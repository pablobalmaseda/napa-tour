import { useState, useEffect, useRef, useCallback } from 'react';
import type { PresentationTabId } from '../types/presentation';

export interface SyncMessage {
  type: 'SYNC_STATE' | 'SET_SLIDE' | 'SET_TAB' | 'SET_PHOTO' | 'GET_STATE' | 'PING_PRESENCE';
  senderId?: string;
  currentSlideIndex?: number;
  activeTab?: PresentationTabId;
  photoIndex?: number;
  isLightboxOpen?: boolean;
  clientsCount?: number;
  timestamp?: number;
}

// Minimal, zero-dependency MQTT 3.1.1 over WebSocket helpers for cloud real-time sync
function encodeMqttLength(len: number): number[] {
  const out: number[] = [];
  do {
    let b = len % 128;
    len = Math.floor(len / 128);
    if (len > 0) b |= 128;
    out.push(b);
  } while (len > 0);
  return out;
}

function encodeMqttString(str: string): Uint8Array {
  const enc = new TextEncoder().encode(str);
  const out = new Uint8Array(2 + enc.length);
  out[0] = (enc.length >> 8) & 0xff;
  out[1] = enc.length & 0xff;
  out.set(enc, 2);
  return out;
}

function concatUint8(arrays: Uint8Array[]): ArrayBuffer {
  const total = arrays.reduce((acc, a) => acc + a.length, 0);
  const buf = new ArrayBuffer(total);
  const out = new Uint8Array(buf);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return buf;
}

function buildMqttConnect(clientId: string): ArrayBuffer {
  const proto = encodeMqttString('MQTT');
  const flags = new Uint8Array([4, 2, 0, 60]); // MQTT 3.1.1, CleanSession, 60s KeepAlive
  const payload = encodeMqttString(clientId);
  const remLen = proto.length + flags.length + payload.length;
  return concatUint8([new Uint8Array([0x10, ...encodeMqttLength(remLen)]), proto, flags, payload]);
}

function buildMqttSubscribe(topic: string): ArrayBuffer {
  const packetId = new Uint8Array([0x00, 0x01]);
  const topicBuf = encodeMqttString(topic);
  const qos = new Uint8Array([0x00]);
  const remLen = packetId.length + topicBuf.length + qos.length;
  return concatUint8([new Uint8Array([0x82, ...encodeMqttLength(remLen)]), packetId, topicBuf, qos]);
}

function buildMqttPublish(topic: string, message: string, retain = false): ArrayBuffer {
  const topicBuf = encodeMqttString(topic);
  const msgBuf = new TextEncoder().encode(message);
  const remLen = topicBuf.length + msgBuf.length;
  const headerByte = retain ? 0x31 : 0x30;
  return concatUint8([new Uint8Array([headerByte, ...encodeMqttLength(remLen)]), topicBuf, msgBuf]);
}

// Parse all MQTT packets in a WebSocket frame (handles concatenated CONNACK/SUBACK/PUBLISH frames)
function parseMqttPackets(u8: Uint8Array): { hasConnAck: boolean; payloads: string[] } {
  let hasConnAck = false;
  const payloads: string[] = [];
  let offset = 0;

  while (offset < u8.length) {
    const header = u8[offset];
    const packetType = header & 0xf0;
    let idx = offset + 1;
    let remLen = 0;
    let multiplier = 1;

    while (idx < u8.length) {
      const encodedByte = u8[idx++];
      remLen += (encodedByte & 127) * multiplier;
      multiplier *= 128;
      if ((encodedByte & 128) === 0) break;
    }

    const packetEnd = idx + remLen;
    if (packetEnd > u8.length) break;

    if (packetType === 0x20) {
      hasConnAck = true;
    } else if (packetType === 0x30) {
      let pIdx = idx;
      if (pIdx + 2 <= packetEnd) {
        const topicLen = (u8[pIdx] << 8) | u8[pIdx + 1];
        pIdx += 2 + topicLen;
        if ((header & 0x06) > 0) {
          pIdx += 2; // QoS > 0 packet ID
        }
        if (pIdx <= packetEnd) {
          payloads.push(new TextDecoder().decode(u8.slice(pIdx, packetEnd)));
        }
      }
    }

    offset = packetEnd;
  }

  return { hasConnAck, payloads };
}

export function getSyncRoomId(): string {
  if (typeof window === 'undefined') return 'main-flight';
  const params = new URLSearchParams(window.location.search);
  return params.get('room') || 'main-flight';
}

export function usePresentationSync(
  initialIndex: number,
  totalSlides: number,
  onExternalChange?: (newIndex: number) => void
) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialIndex);
  const currentSlideIndexRef = useRef(initialIndex);

  const [activeTab, setActiveTabState] = useState<PresentationTabId>('story');
  const activeTabRef = useRef<PresentationTabId>('story');

  const [photoIndex, setPhotoIndexState] = useState(0);
  const photoIndexRef = useRef(0);

  const [isLightboxOpen, setIsLightboxOpenState] = useState(false);
  const isLightboxOpenRef = useRef(false);

  const [isLocalConnected, setIsLocalConnected] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [localClientsCount, setLocalClientsCount] = useState(1);
  const [cloudPeersCount, setCloudPeersCount] = useState(1);

  const senderIdRef = useRef('peer_' + Math.random().toString(36).slice(2, 10));
  const seenPeersRef = useRef<Map<string, number>>(new Map());
  const localSocketRef = useRef<WebSocket | null>(null);
  const cloudSocketRef = useRef<WebSocket | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const roomTopicRef = useRef(`napa-tour/sync/${getSyncRoomId()}`);

  const dispatchPhotoSyncEvent = useCallback((nextPhotoIdx: number, nextLightbox: boolean) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('wine-photo-sync', {
          detail: { photoIndex: nextPhotoIdx, isLightboxOpen: nextLightbox }
        })
      );
    }
  }, []);

  const applyIncomingSync = useCallback(
    (data: SyncMessage) => {
      if (data.senderId && data.senderId !== senderIdRef.current) {
        seenPeersRef.current.set(data.senderId, Date.now());
        const now = Date.now();
        for (const [peer, ts] of seenPeersRef.current.entries()) {
          if (now - ts > 45000) seenPeersRef.current.delete(peer);
        }
        setCloudPeersCount(1 + seenPeersRef.current.size);
      }

      if (data.type === 'SYNC_STATE') {
        let slideChanged = false;
        if (
          typeof data.currentSlideIndex === 'number' &&
          data.currentSlideIndex >= 0 &&
          data.currentSlideIndex < totalSlides &&
          data.currentSlideIndex !== currentSlideIndexRef.current
        ) {
          currentSlideIndexRef.current = data.currentSlideIndex;
          setCurrentSlideIndex(data.currentSlideIndex);
          slideChanged = true;
          onExternalChange?.(data.currentSlideIndex);
        }

        if (data.activeTab && data.activeTab !== activeTabRef.current) {
          activeTabRef.current = data.activeTab;
          setActiveTabState(data.activeTab);
        } else if (slideChanged && !data.activeTab) {
          activeTabRef.current = 'story';
          setActiveTabState('story');
        }

        let photoChanged = false;
        if (typeof data.photoIndex === 'number' && data.photoIndex !== photoIndexRef.current) {
          photoIndexRef.current = data.photoIndex;
          setPhotoIndexState(data.photoIndex);
          photoChanged = true;
        }
        if (typeof data.isLightboxOpen === 'boolean' && data.isLightboxOpen !== isLightboxOpenRef.current) {
          isLightboxOpenRef.current = data.isLightboxOpen;
          setIsLightboxOpenState(data.isLightboxOpen);
          photoChanged = true;
        }
        if (photoChanged) {
          dispatchPhotoSyncEvent(photoIndexRef.current, isLightboxOpenRef.current);
        }
      }
    },
    [totalSlides, onExternalChange, dispatchPhotoSyncEvent]
  );

  // Helper to broadcast full current state across all active transports
  const broadcastFullState = useCallback((retainCloud = true) => {
    const stateMsg: SyncMessage = {
      type: 'SYNC_STATE',
      senderId: senderIdRef.current,
      currentSlideIndex: currentSlideIndexRef.current,
      activeTab: activeTabRef.current,
      photoIndex: photoIndexRef.current,
      isLightboxOpen: isLightboxOpenRef.current,
      timestamp: Date.now()
    };

    // 1. Cloud MQTT over WSS
    if (cloudSocketRef.current && cloudSocketRef.current.readyState === WebSocket.OPEN) {
      try {
        cloudSocketRef.current.send(
          buildMqttPublish(roomTopicRef.current, JSON.stringify(stateMsg), retainCloud)
        );
      } catch {
        // ignore send errors
      }
    }

    // 2. Local HTTP /api/sync-state (triggers Vite server broadcast even if mobile WS was asleep)
    const host = window.location.hostname;
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.')
    ) {
      fetch('/api/sync-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateMsg)
      }).catch(() => {});
    }

    // 3. BroadcastChannel (same browser)
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage(stateMsg);
      } catch {
        // ignore
      }
    }
  }, []);

  // 1. Set up BroadcastChannel (same-browser tabs)
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('wine-presentation-sync');
      broadcastChannelRef.current = bc;
      bc.onmessage = (event: MessageEvent<SyncMessage>) => {
        if (event.data) applyIncomingSync(event.data);
      };
      return () => bc.close();
    }
  }, [applyIncomingSync]);

  // 2. Set up Cloud MQTT-over-WSS Relay (works on Vercel / GitHub / Mobile / Anywhere)
  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let keepAliveInterval: ReturnType<typeof setInterval>;
    let isUnmounted = false;
    let activeWs: WebSocket | null = null;

    function connectCloud() {
      if (isUnmounted) return;
      try {
        // Unique MQTT ClientID per socket instance so React StrictMode double-mount never collides
        const mqttClientId = `${senderIdRef.current}_${Math.random().toString(36).slice(2, 7)}`;
        const ws = new WebSocket('wss://broker.emqx.io:8084/mqtt', 'mqtt');
        ws.binaryType = 'arraybuffer';
        activeWs = ws;
        cloudSocketRef.current = ws;

        ws.onopen = () => {
          if (isUnmounted || cloudSocketRef.current !== ws) {
            ws.close();
            return;
          }
          ws.send(buildMqttConnect(mqttClientId));

          keepAliveInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(new Uint8Array([0xc0, 0x00]).buffer); // MQTT PINGREQ
              const presenceMsg: SyncMessage = {
                type: 'PING_PRESENCE',
                senderId: senderIdRef.current,
                timestamp: Date.now()
              };
              ws.send(buildMqttPublish(roomTopicRef.current, JSON.stringify(presenceMsg), false));
            }
          }, 20000);
        };

        ws.onmessage = (event) => {
          if (isUnmounted || !(event.data instanceof ArrayBuffer)) return;
          const u8 = new Uint8Array(event.data);
          const { hasConnAck, payloads } = parseMqttPackets(u8);

          if (hasConnAck && ws.readyState === WebSocket.OPEN) {
            ws.send(buildMqttSubscribe(roomTopicRef.current));
            setIsCloudConnected(true);
            const presenceMsg: SyncMessage = {
              type: 'PING_PRESENCE',
              senderId: senderIdRef.current,
              timestamp: Date.now()
            };
            ws.send(buildMqttPublish(roomTopicRef.current, JSON.stringify(presenceMsg), false));
          }

          for (const payloadStr of payloads) {
            try {
              const data: SyncMessage = JSON.parse(payloadStr);
              if (data.senderId === senderIdRef.current) continue;
              applyIncomingSync(data);
            } catch {
              // ignore malformed JSON
            }
          }
        };

        ws.onclose = () => {
          clearInterval(keepAliveInterval);
          if (cloudSocketRef.current === ws) {
            cloudSocketRef.current = null;
            setIsCloudConnected(false);
          }
          if (!isUnmounted) {
            reconnectTimeout = setTimeout(connectCloud, 2000);
          }
        };

        ws.onerror = () => {
          if (cloudSocketRef.current === ws) {
            setIsCloudConnected(false);
          }
        };
      } catch {
        setIsCloudConnected(false);
        if (!isUnmounted) {
          reconnectTimeout = setTimeout(connectCloud, 3000);
        }
      }
    }

    connectCloud();

    return () => {
      isUnmounted = true;
      clearTimeout(reconnectTimeout);
      clearInterval(keepAliveInterval);
      if (activeWs) {
        activeWs.onclose = null;
        activeWs.onerror = null;
        activeWs.onmessage = null;
        activeWs.onopen = null;
        if (cloudSocketRef.current === activeWs) {
          cloudSocketRef.current = null;
        }
        activeWs.close();
      }
    };
  }, [applyIncomingSync]);

  // 3. Set up Local Vite WebSocket (/sync-ws) + HTTP fallback when running on local dev network
  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let pollInterval: ReturnType<typeof setInterval>;
    let isUnmounted = false;
    let activeWs: WebSocket | null = null;

    const host = window.location.hostname;
    const isLocalNetwork =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.');

    if (!isLocalNetwork) return;

    function connectLocal() {
      if (isUnmounted) return;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/sync-ws`;

      try {
        const ws = new WebSocket(wsUrl);
        activeWs = ws;
        localSocketRef.current = ws;

        ws.onopen = () => {
          if (isUnmounted || localSocketRef.current !== ws) {
            ws.close();
            return;
          }
          setIsLocalConnected(true);
          ws.send(JSON.stringify({ type: 'GET_STATE' }));
        };

        ws.onmessage = (event) => {
          if (isUnmounted) return;
          try {
            const data: SyncMessage = JSON.parse(event.data);
            if (typeof data.clientsCount === 'number') {
              setLocalClientsCount(data.clientsCount);
            }
            applyIncomingSync(data);
          } catch {
            // ignore
          }
        };

        ws.onclose = () => {
          if (localSocketRef.current === ws) {
            localSocketRef.current = null;
            setIsLocalConnected(false);
          }
          if (!isUnmounted) {
            reconnectTimeout = setTimeout(connectLocal, 2000);
          }
        };

        ws.onerror = () => {
          if (localSocketRef.current === ws) {
            setIsLocalConnected(false);
          }
        };
      } catch {
        setIsLocalConnected(false);
      }
    }

    connectLocal();

    // Lightweight HTTP state check every 800ms on local network as bulletproof fallback
    pollInterval = setInterval(() => {
      fetch('/api/sync-state')
        .then((r) => r.json())
        .then((data: SyncMessage) => {
          if (!isUnmounted && data?.type === 'SYNC_STATE') {
            setIsLocalConnected(true);
            if (typeof data.clientsCount === 'number') {
              setLocalClientsCount(Math.max(data.clientsCount, 2));
            }
            applyIncomingSync(data);
          }
        })
        .catch(() => {});
    }, 800);

    return () => {
      isUnmounted = true;
      clearTimeout(reconnectTimeout);
      clearInterval(pollInterval);
      if (activeWs) {
        activeWs.onclose = null;
        activeWs.onerror = null;
        activeWs.onmessage = null;
        activeWs.onopen = null;
        if (localSocketRef.current === activeWs) {
          localSocketRef.current = null;
        }
        activeWs.close();
      }
    };
  }, [applyIncomingSync]);

  // Listen for local desktop WineryCarousel user clicks so phone stays in sync too
  useEffect(() => {
    const handleLocalPhotoAction = (e: Event) => {
      const detail = (e as CustomEvent<{ photoIndex: number; isLightboxOpen: boolean }>).detail;
      if (!detail) return;
      let changed = false;
      if (typeof detail.photoIndex === 'number' && detail.photoIndex !== photoIndexRef.current) {
        photoIndexRef.current = detail.photoIndex;
        setPhotoIndexState(detail.photoIndex);
        changed = true;
      }
      if (typeof detail.isLightboxOpen === 'boolean' && detail.isLightboxOpen !== isLightboxOpenRef.current) {
        isLightboxOpenRef.current = detail.isLightboxOpen;
        setIsLightboxOpenState(detail.isLightboxOpen);
        changed = true;
      }
      if (changed) {
        if (localSocketRef.current && localSocketRef.current.readyState === WebSocket.OPEN) {
          localSocketRef.current.send(
            JSON.stringify({
              type: 'SET_PHOTO',
              photoIndex: photoIndexRef.current,
              isLightboxOpen: isLightboxOpenRef.current
            })
          );
        }
        broadcastFullState(true);
      }
    };

    window.addEventListener('wine-photo-local-change', handleLocalPhotoAction);
    return () => window.removeEventListener('wine-photo-local-change', handleLocalPhotoAction);
  }, [broadcastFullState]);

  // Navigate to a specific slide
  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalSlides) return;
      currentSlideIndexRef.current = index;
      setCurrentSlideIndex(index);

      activeTabRef.current = 'story';
      setActiveTabState('story');

      photoIndexRef.current = 0;
      setPhotoIndexState(0);

      isLightboxOpenRef.current = false;
      setIsLightboxOpenState(false);
      dispatchPhotoSyncEvent(0, false);

      if (localSocketRef.current && localSocketRef.current.readyState === WebSocket.OPEN) {
        localSocketRef.current.send(JSON.stringify({ type: 'SET_SLIDE', index }));
      }
      broadcastFullState(true);
    },
    [totalSlides, broadcastFullState, dispatchPhotoSyncEvent]
  );

  const nextSlide = useCallback(() => {
    const current = currentSlideIndexRef.current;
    if (current < totalSlides - 1) {
      goToSlide(current + 1);
    }
  }, [totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    const current = currentSlideIndexRef.current;
    if (current > 0) {
      goToSlide(current - 1);
    }
  }, [goToSlide]);

  // Switch active TV presentation tab ('story' | 'palate' | 'food')
  const setActiveTab = useCallback(
    (tabOrUpdater: PresentationTabId | ((prev: PresentationTabId) => PresentationTabId)) => {
      const nextTab =
        typeof tabOrUpdater === 'function' ? tabOrUpdater(activeTabRef.current) : tabOrUpdater;
      activeTabRef.current = nextTab;
      setActiveTabState(nextTab);

      if (localSocketRef.current && localSocketRef.current.readyState === WebSocket.OPEN) {
        localSocketRef.current.send(JSON.stringify({ type: 'SET_TAB', tab: nextTab }));
      }
      broadcastFullState(true);
    },
    [broadcastFullState]
  );

  // Control Winery Photo Carousel, Fullscreen Lightbox, or 5 S's Step (0..4) on the TV
  const setPhotoState = useCallback(
    (nextPhotoIdx?: number, nextLightbox?: boolean) => {
      const resolvedIdx =
        typeof nextPhotoIdx === 'number' ? Math.max(0, nextPhotoIdx) : photoIndexRef.current;
      const resolvedLightbox =
        typeof nextLightbox === 'boolean' ? nextLightbox : isLightboxOpenRef.current;

      photoIndexRef.current = resolvedIdx;
      setPhotoIndexState(resolvedIdx);
      isLightboxOpenRef.current = resolvedLightbox;
      setIsLightboxOpenState(resolvedLightbox);

      dispatchPhotoSyncEvent(resolvedIdx, resolvedLightbox);

      if (localSocketRef.current && localSocketRef.current.readyState === WebSocket.OPEN) {
        localSocketRef.current.send(
          JSON.stringify({
            type: 'SET_PHOTO',
            photoIndex: resolvedIdx,
            isLightboxOpen: resolvedLightbox
          })
        );
      }
      broadcastFullState(true);
    },
    [broadcastFullState, dispatchPhotoSyncEvent]
  );

  const nextPhoto = useCallback(() => {
    setPhotoState((photoIndexRef.current + 1) % 3, isLightboxOpenRef.current);
  }, [setPhotoState]);

  const prevPhoto = useCallback(() => {
    setPhotoState((photoIndexRef.current + 2) % 3, isLightboxOpenRef.current);
  }, [setPhotoState]);

  const toggleLightbox = useCallback(() => {
    setPhotoState(photoIndexRef.current, !isLightboxOpenRef.current);
  }, [setPhotoState]);

  const isConnected = isLocalConnected || isCloudConnected;
  const clientsCount = Math.max(localClientsCount, cloudPeersCount);

  return {
    currentSlideIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    activeTab,
    setActiveTab,
    photoIndex,
    isLightboxOpen,
    setPhotoState,
    nextPhoto,
    prevPhoto,
    toggleLightbox,
    isConnected,
    clientsCount
  };
}
