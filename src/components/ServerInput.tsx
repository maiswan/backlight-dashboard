import { useState } from "react";
import { useDashboardContext } from "../hooks/useCommandContext";

export default function ServerInput() {

    const { server, setServer } = useDashboardContext();

    const [tempServer, setTempServer] = useState<string | null>(null);

    return (
        <form className="flex flex-col md:flex-row gap-y-2 gap-1 md:gap-y-1 mb-4" action={() => setServer(tempServer ?? "")}>
            <h1 className="text-nowrap mr-4">maiswan/backlight</h1>
            <div className="flex-1 flex flex-row gap-1">
                <input value={tempServer ?? server} onChange={(e) => setTempServer(e.target.value)} placeholder="http://192.168.12.02:12021" />
                <button className="px-4!">Connect</button>
            </div>
        </form>
    )
}