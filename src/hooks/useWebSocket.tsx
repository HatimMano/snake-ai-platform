import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url: string) => {
    // State to store the latest game state received from the server
    const [state, setState] = useState<number[]>([]);

    // State to track if the WebSocket connection is active
    const [isConnected, setIsConnected] = useState(false);

    // Reference to the WebSocket instance (persists across renders)
    const socketRef = useRef<WebSocket | null>(null);

    /**
     * Establish a WebSocket connection.
     * Handles opening, closing, receiving messages, and errors.
     */
    const connect = () => {
        // Close existing connection if already connected
        if (socketRef.current) {
            socketRef.current.close();
        }

        // Create a new WebSocket connection
        socketRef.current = new WebSocket(url);

        // ✅ Handle successful connection
        socketRef.current.onopen = () => {
            console.log('✅ Connected to WebSocket');
            setIsConnected(true);

            // Send initial message to start the game or handshake
            sendMessage({ action: 'start' });
        };

        // ✅ Handle incoming messages
        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setState(data.state); // ✅ Update state with server response
            } catch (error) {
                console.error('❌ Error parsing WebSocket message:', error);
            }
        };

        // ✅ Handle connection closure
        socketRef.current.onclose = (event) => {
            console.log(`🔴 WebSocket closed: Code ${event.code}, Reason: ${event.reason}`);
            setIsConnected(false);
        };

        // ✅ Handle WebSocket errors
        socketRef.current.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            setIsConnected(false);
        };
    };

    /**
     * Send a message to the WebSocket server.
     * Ensures that the socket is open before sending.
     *
     * @param message - Object to send as JSON
     */
    const sendMessage = (message: object) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            try {
                socketRef.current.send(JSON.stringify(message));
            } catch (error) {
                console.error('❌ Failed to send WebSocket message:', error);
            }
        } else {
            console.warn('⚠️ Attempted to send message while socket is closed');
        }
    };

    /**
     * Automatically connect the WebSocket when the component mounts.
     * Cleanup by closing the socket when the component unmounts.
     */
    useEffect(() => {
        connect();

        // Cleanup function to close WebSocket connection on unmount
        return () => {
            if (socketRef.current) {
                console.log('🛑 Closing WebSocket connection...');
                socketRef.current.close();
            }
        };
    }, [url]); // ✅ Reconnect if the URL changes

    /**
     * Expose state and functions for external use.
     */
    return {
        state,        // Latest state from server
        isConnected,  // Connection status
        sendMessage,  // Function to send messages to server
        connect,      // Function to manually reconnect
    };
};

export default useWebSocket;
