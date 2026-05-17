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
                const data = JSON.parse(event.data);
                if (data.type === 'INIT') {
                    // Handle initial data
                    useIssueStore.getState().setIssues(data.issues);
                } else if (data.type === 'ISSUE_UPDATE') {
                    // Handle issue updates if needed
                    useIssueStore.getState().updateIssue(data.issue);
                } else if (data.type === 'ISSUE_ADDED') {
                    // Handle new issue if needed
                    useIssueStore.getState().addIssue(data.issue);
                }
            };

            ws.current.onclose = () => {
                setConnected('disconnected');
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