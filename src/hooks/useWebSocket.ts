import React, { useEffect, useRef } from "react";
import { useIssueStore } from "../store";
import { WS_URL } from "../constants";

const useWebSocket = () => {
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const setConnected = useIssueStore(state => state.setConnectionStatus);
    const setLoading = useIssueStore(state => state.setIsLoading);

    const send = (msg: object) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(msg))
        }
    };

    useEffect(() => {
        const connectWebSocket = () => {
            setLoading(true);
            ws.current = new WebSocket(WS_URL);

            ws.current.onopen = () => {
                setConnected('connected');
                setLoading(false);
            };

            ws.current.onmessage = (event) => {
                console.log('RAW MESSAGE:', event.data);
                const data = JSON.parse(event.data);
                if (data.type === 'INIT' && data.issues) {
                    console.log('Received initial issues:', data.issues);
                    useIssueStore.getState().setIssues(data.issues);
                } else if (data.type === 'ISSUE_UPDATE') {
                    // Handle issue updates if needed
                    console.log('Received issue update:', data.issue);
                    useIssueStore.getState().updateIssue(data.issue);
                } else if (data.type === 'ISSUE_ADDED') {
                    // Handle new issue if needed
                    console.log('Received new issue:', data.issue);
                    useIssueStore.getState().addIssue(data.issue);
                }
            };

            ws.current.onclose = () => {
                setConnected('disconnected');
                console.log('WebSocket disconnected');
                setLoading(false);
                // Attempt to reconnect after a delay
                reconnectTimeout.current = setTimeout(connectWebSocket, 5000);
            };
        };

        connectWebSocket();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, []);

    return { send };
};


export default useWebSocket;