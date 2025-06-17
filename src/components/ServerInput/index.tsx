import { useState, useCallback, type SetStateAction, type Dispatch } from "react";

interface ServerInputProps {
    server: string,
    setServer: Dispatch<SetStateAction<string>>,
}

export default function ServerInput({ server, setServer }:  ServerInputProps) {
    const [localServer, setLocalServer] = useState(server);

     // Writeback, debounce input until reconnect clicked
    const reconnect = useCallback(() => {
        setServer(localServer)
    }, [localServer, setServer])

    return (
        <>
            <h2>Server IP</h2>
            <div className="flex flex-row gap-4">
                <input className="basis-full" placeholder="http://192.168.1.4:12021"
                    value={localServer} onChange={e => setLocalServer(e.target.value)}></input>
                <button onClick={reconnect}>Reconnect</button>
            </div>
        </>
    )
}