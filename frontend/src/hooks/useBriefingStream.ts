import { useEffect, useRef, useState } from 'react';
import { useBriefingStore } from '../store/useBriefingStore';

export const useBriefingStream = (topicId: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setMeta, setTimeline, addCard, setDisagreements } = useBriefingStore();

  useEffect(() => {
    // Reset store when topic changes
    useBriefingStore.getState().clearData();
    
    // Connect to global briefing socket
    const wsUrl = `ws://localhost:8000/ws/briefing`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log(`Briefing stream connected for topic: ${topicId}`);
      ws.current?.send(JSON.stringify({ topic: topicId }));
      setIsConnected(true);
      setError(null);
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WS Event Type:', message.event);

        switch (message.event) {
          case 'briefing_start':
            setMeta(message.payload);
            break;
          case 'timeline_ready':
            setTimeline(message.payload.events);
            break;
          case 'card_ready':
            addCard(message.payload);
            break;
          case 'disagreements_ready':
            setDisagreements(message.payload.critical_takes);
            break;
          default:
            console.warn('Unknown event received', message);
        }
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };

    ws.current.onerror = (evt) => {
      console.error('WS Error:', evt);
      setError('Connection to backend failed.');
    };

    ws.current.onclose = () => {
      console.log('Briefing stream closed');
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [topicId, setMeta, setTimeline, addCard, setDisagreements]);

  return { isConnected, error };
};
