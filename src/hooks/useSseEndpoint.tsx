import { useRef, useEffect } from "react";
import toast from "react-hot-toast";
import type { Command } from "../types/command";
import type { SseData } from "../types/SseData";


const STREAM_CONFIG_PATH = "api/v2/config/stream";

export default function useSseEndpoint(
    server: string,
    callback: (commands: Command[]) => void)
{

    const hasOfflineToast = useRef(false); // avoid spamming "server offline"
    const currentServer = useRef("");
    
    useEffect(() => {
        if (currentServer.current) { return; }
        currentServer.current = server;

        callback([]);
        if (!server) { return; }

        const source = new EventSource(`${server}/${STREAM_CONFIG_PATH}`);
        source.onmessage = (e) => {
            try {
                const config: SseData = JSON.parse(e.data);
                callback(config.commands)
            } catch {
                toast.error("Unknown error");
            }
        };
        source.onopen = () => toast.success("Connected to server.");
        source.onerror = () => {
            if (hasOfflineToast.current) { return; }
            hasOfflineToast.current = true;
            currentServer.current = "";
            toast.error("Server offline.");
        }
        return () => {
            source.close();
            currentServer.current = "";
        }
    }, [callback, server]);

}