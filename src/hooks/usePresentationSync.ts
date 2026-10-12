import { useState, useEffect, useRef, useCallback } from 'react';

interface SyncMessage {
  type: 'SYNC_STATE' | 'SET_SLIDE' | 'GET_STATE';
  currentSlideIndex?: number;
  clientsCount?: number;
  timestamp?: number;
}

export function usePresentationSync(
  initialIndex: number,
  totalSlides: number,
  onExternalChange?: (newIndex: number) => void
) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialIndex);
  const currentSlideIndexRef = useRef(initialIndex);
  const [isConnected, setIsConnected] = useState(false);
  const [clientsCount, setClientsCount] = useState(1);
  const socketRef = useRef<WebSocket | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Safe internal state updater that synchronizes the ref
  const setIndexInternal = useCallback((index: number) => {
    currentSlideIndexRef.current = index;
    setCurrentSlideIndex(index);
  }, []);

  // Set up BroadcastChannel (fallback / dual channel for same-browser windows)
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('wine-presentation-sync');
      broadcastChannelRef.current = bc;

      bc.onmessage = (event: MessageEvent<SyncMessage>) => {
        if (event.data?.type === 'SYNC_STATE' && typeof event.data.currentSlideIndex === 'number') {
          const newIdx = event.data.currentSlideIndex;
          if (newIdx >= 0 && newIdx < totalSlides && newIdx !== currentSlideIndexRef.current) {
            setIndexInternal(newIdx);
            onExternalChange?.(newIdx);
          }
        }
      };

      return () => {
        bc.close();
      };
    }
  }, [totalSlides, onExternalChange, setIndexInternal]);

  // Set up WebSocket connection to Vite sync server
  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isUnmounted = false;

    function connect() {
      if (isUnmounted) return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/sync-ws`;

      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (isUnmounted) {
            ws.close();
            return;
          }
          setIsConnected(true);
          // Request initial state from server
          ws.send(JSON.stringify({ type: 'GET_STATE' }));
        };

        ws.onmessage = (event) => {
          try {
            const data: SyncMessage = JSON.parse(event.data);
            if (data.type === 'SYNC_STATE' && typeof data.currentSlideIndex === 'number') {
              const newIdx = data.currentSlideIndex;
              if (newIdx >= 0 && newIdx < totalSlides && newIdx !== currentSlideIndexRef.current) {
                setIndexInternal(newIdx);
                onExternalChange?.(newIdx);
              }
              if (typeof data.clientsCount === 'number') {
                setClientsCount(data.clientsCount);
              }
            }
          } catch {
            // ignore non-json
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          socketRef.current = null;
          if (!isUnmounted) {
            reconnectTimeout = setTimeout(connect, 2000);
          }
        };

        ws.onerror = () => {
          setIsConnected(false);
        };
      } catch {
        setIsConnected(false);
        if (!isUnmounted) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      }
    }

    connect();

    return () => {
      isUnmounted = true;
      clearTimeout(reconnectTimeout);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [totalSlides, onExternalChange, setIndexInternal]);

  // Navigate to a specific slide
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= totalSlides) return;
    if (index === currentSlideIndexRef.current) return;

    setIndexInternal(index);

    // Broadcast through WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'SET_SLIDE',
        index
      }));
    }

    // Broadcast through BroadcastChannel
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'SYNC_STATE',
        currentSlideIndex: index,
        timestamp: Date.now()
      });
    }
  }, [totalSlides, setIndexInternal]);

  // Navigate strictly one step forward
  const nextSlide = useCallback(() => {
    const current = currentSlideIndexRef.current;
    if (current < totalSlides - 1) {
      goToSlide(current + 1);
    }
  }, [totalSlides, goToSlide]);

  // Navigate strictly one step backward
  const prevSlide = useCallback(() => {
    const current = currentSlideIndexRef.current;
    if (current > 0) {
      goToSlide(current - 1);
    }
  }, [goToSlide]);

  return {
    currentSlideIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    isConnected,
    clientsCount
  };
}
