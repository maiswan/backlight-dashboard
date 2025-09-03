import type { Command, CommandTemplate } from "../types/command";
import { createContext, useContext, type ReactNode, type Dispatch, type SetStateAction, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export interface DashboardContextValue {
    commands: Command[];
    setCommands: Dispatch<SetStateAction<Command[]>>;
    addCommandFromTemplate: (template: CommandTemplate, name?: string) => void;

    favoriteCommands: CommandTemplate[];
    setFavoriteCommands: Dispatch<SetStateAction<CommandTemplate[]>>;

    server: string;
    setServer: Dispatch<SetStateAction<string>>;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (context == undefined) {
        throw new Error("useDashboardContext must be used within an DashbaordProvider");
    }
    return context;
}

export const DashbaordProvider = ({ children }: { children: ReactNode }) => {

    const [commands, setCommands] = useState<Command[]>([]);
    const [favoriteCommands, setFavoriteCommands] = useState<CommandTemplate[]>(JSON.parse(localStorage.getItem("favoriteCommands") ?? "[]"));
    const [server, setServer] = useState<string>(localStorage.getItem("server") || window.location.origin);

    const addCommandFromTemplate = useCallback((template: CommandTemplate, name?: string) => {
        setCommands(prev => {
            const command: Command = {
                name: name ?? `Command ${prev.length + 1}`,
                id: uuidv4(),
                z_index: 0,
                is_enabled: true,
                ...template,
            }
            return [command, ...prev];
        })
    }, []);

    const value = {
        commands,
        setCommands,
        addCommandFromTemplate,
        favoriteCommands,
        setFavoriteCommands,
        server,
        setServer
    }

    // Writebacks
    useEffect(() => { localStorage.setItem("server", server) }, [server]);
    useEffect(() => { localStorage.setItem("favoriteCommands", JSON.stringify(favoriteCommands)) }, [favoriteCommands]);

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    )
}