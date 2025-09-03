import { useCallback } from "react";
import { useDashboardContext } from "../../hooks/useCommandContext";
import type { CommandMode } from "../../types/command";
import { ALPHA_COMMAND, GAMMA_COMMAND, KELVIN_COMMAND, RGB_COMMAND } from "./QuickCommands";

interface CommandButtonProps {
    color: string;
    text: string;
    mode: CommandMode;
    parameters: Record<string, unknown>;
}

function CommandModeToString(commandMode: CommandMode, parameter: string) {
    if (commandMode === RGB_COMMAND) { return parameter; }
    if (commandMode === KELVIN_COMMAND) { return parameter; }
    if (commandMode === ALPHA_COMMAND) { return `${parameter} alpha`; }
    if (commandMode === GAMMA_COMMAND) { return `${parameter} gamma`; }
    throw new Error("Invalid command mode");
}

export default function CommandButton({ color, text, mode, parameters }: CommandButtonProps) {

    const { addCommandFromTemplate } = useDashboardContext();

    const handleApplyCommand = useCallback(() => {
        addCommandFromTemplate({
            mode,
            targets: "",
            name: CommandModeToString(mode, text),
            ...parameters,
        })
    }, [addCommandFromTemplate, mode, text, parameters]);

    return (
        <button onClick={handleApplyCommand} className="flex flex-1 flex-row items-center gap-x-2">
            <div className="rounded-full h-4 w-4" style={{ backgroundColor: color }}></div>
            <div>{text}</div>
        </button>
    )
}
