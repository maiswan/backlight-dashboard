import { useRef, useState } from "react";
import { useDashboardContext } from "../hooks/useCommandContext";
import Expandable from "./Expandable";

export default function ServerInput() {

    const { server, setServer } = useDashboardContext();
    const initialServer = useRef(server);

    const [tempServer, setTempServer] = useState<string | null>(null);

    return (
        <Expandable title="Server" isInitiallyExpanded={initialServer.current === ""}>
            <form className="flex flex-row gap-1 m-0" action={() => setServer(tempServer ?? "")}>
                <input value={tempServer ?? server} onChange={(e) => setTempServer(e.target.value)} placeholder="http://192.168.12.02:12021" className="basis-4/5" />
                <button className="basis-1/5">Connect</button>
            </form>
        </Expandable>
    )
}