import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import type { Config } from "../config";
import type { Instruction } from "../instructions/instructionSchema";

export default function useSseEndpoint(server: string, setInstructions: (i: Instruction[]) => void, setLastPing: (d: Date) => void) {
    
    const hasOfflineToast = useRef(false); // avoid spamming "server offline"
    
    useEffect(() => {
        setInstructions([]);
        const source = new EventSource(`${server}/state?stream=true`);
        source.onmessage = (e) => {
            try {
                const config: Config = JSON.parse(e.data);
                setInstructions(config.instructions);
                setLastPing(new Date());
            } catch {
                toast.error("Failed to parse server response");
            }
        };
        source.onopen = () => toast.success("Connected to server.");
        source.onerror = () => {
            if (hasOfflineToast.current) { return; }
            hasOfflineToast.current = true;
            toast.error("Server offline.");
        }
        return () => source.close();
    }, [server, setInstructions, setLastPing]);
}