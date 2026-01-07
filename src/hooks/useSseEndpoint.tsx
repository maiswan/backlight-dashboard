import { useRef, useEffect } from "react";
import toast from "react-hot-toast";
import type { Command } from "../types/command";
import type { SseData } from "../types/SseData";


const STREAM_CONFIG_PATH = "api/v3/config/stream";

export default function useSseEndpoint(
    server: string,
    callback: (commands: Command[]) => void)
{
    const hasOfflineToast = useRef(false); // avoid spamming "server offline"
  
    useEffect(() => {
        callback([]);

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
            toast.error("Server offline.");
        }
        return () => {
            source.close();
        }
    }, [callback, server]);

}