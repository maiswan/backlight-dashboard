import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { CommandModes, CommandSchema, type Command, type CommandMode, type CommandTemplate } from "../../types/command";
import Expandable from "../Expandable";
import { useDashboardContext } from "../../hooks/useCommandContext";

interface CommandEntryProps {
    command: Command
    isTop: boolean,
    isBottom: boolean,
    index: number,
    moveCommand: (index: number, direction: 1 | -1) => void,
    removeCommand: (id: string) => void,
}

function getParametersForMode(parameters: Command | Record<string, unknown>, mode: CommandMode) {
    const output: Record<string, unknown> = {};

    for (const field of CommandSchema[mode]) {
        if (!(field.name in parameters)) { continue; }

        output[field.name] = parameters[field.name];
    }
    return output;
}

const toCommand = (mode: CommandMode, name: string, id: string, isEnabled: boolean, targets: string, parameters: Record<string, unknown>) => {
    return {
        mode,
        name,
        id,
        z_index: -1, // useHttpEndpoint will set this field when sending the // PUT request
        is_enabled: isEnabled,
        targets,
        ...getParametersForMode(parameters, mode),
    } as Command;
}

const isCommandEqualToTemplate = (command: Command, template: CommandTemplate) => {
    if (command.mode !== template.mode) return false;
    if (command.targets !== template.targets) return false;

    const keys = CommandSchema[command.mode].map(x => x.name);
    return keys.every(x => command[x] === template[x]);
}

export default function CommandEntry({ command, isTop, isBottom, index, moveCommand, removeCommand }: CommandEntryProps) {

    const { favoriteCommands, setFavoriteCommands, setCommands } = useDashboardContext();

    const [name, setName] = useState(command.name);
    const [mode, setMode] = useState(command.mode);
    const [targets, setTargets] = useState(command.targets);
    const [isEnabled, setIsEnabled] = useState(command.is_enabled);

    // Keep parameters even if they don't apply to this CommandMode,
    // so when the user returns to the original CommandMode, the parameters remain
    const [parameters, setParameters] = useState<Record<string, unknown>>(getParametersForMode(command, command.mode));

    const isFavorited = useMemo(() => {
        const newCommand = toCommand(mode, name, command.id, isEnabled, targets, parameters);
        return favoriteCommands.some(x => isCommandEqualToTemplate(newCommand, x));
    }, [command.id, favoriteCommands, isEnabled, mode, name, parameters, targets]);

    // Writeback
    useEffect(() => {
        const timeout = setTimeout(() => {
            const newCommand = toCommand(mode, name, command.id, isEnabled, targets, parameters);

            setCommands(prev => prev.map(x => x.id === newCommand.id ? newCommand : x));
        }, 250);

        return () => clearTimeout(timeout);

    }, [name, mode, targets, parameters, isEnabled, command.id, setCommands]);

    const handleIsEnabledClick = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        setIsEnabled(prev => !prev);
    }, []);

    const handleMoveCommand = useCallback((e: MouseEvent, offset: 1 | -1) => {
        e.stopPropagation();
        moveCommand(index, offset);
    }, [index, moveCommand]);

    const handleRemoveCommand = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        removeCommand(command.id);
    }, [command.id, removeCommand]);

    const handleChangeMode = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setMode(e.target.value as CommandMode);
    }, [setMode]);

    const handleSetData = useCallback((key: string, value: string, type: "int" | "float") => {
        const parse = type === "int" ? Number.parseInt : Number.parseFloat;
        setParameters(prev => ({ ...prev, [key]: parse(value) }));
    }, []);

    const handleToggleFavorite = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        if (isFavorited) {
            setFavoriteCommands(prev => {
                return prev.filter(x => !isCommandEqualToTemplate(command, x));
            })
            return;
        }
        const template: CommandTemplate = {
            mode,
            targets,
            ...getParametersForMode(parameters, mode),
        }
        setFavoriteCommands(prev => [...prev, template]);
    }, [command, isFavorited, mode, parameters, setFavoriteCommands, targets]);

    return (
        <div className="flex flex-col md:flex-row gap-1 items-start">
            <div className="flex-1 w-full">
                <Expandable title={
                    <div className="flex flex-row items-center gap-x-4 font-mono">
                        <div>&#x22EE;&#x22EE;</div>
                        <div>{command.name}</div>
                    </div>
                } isInitiallyExpanded={false}>
                    <div className="flex flex-col gap-y-4 font-mono">
                        <div>
                            <div className="secondary">Name</div>
                            <input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div>
                            <div className="secondary">Mode</div>
                            <select value={mode} onChange={handleChangeMode}>
                                {CommandModes.map(x =>
                                    <option value={x}>{x}</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <div className="secondary">Targets</div>
                            <input value={targets} onChange={(e) => setTargets(e.target.value)} />
                        </div>

                        <div className="flex flex-row overflow-auto gap-2 mt-4">
                            {
                                CommandSchema[mode].map(x =>
                                    <div key={x.name} className="flex-1">
                                        <div className="secondary">{x.name}</div>
                                        <input type="number" value={parameters[x.name] as number}
                                            min={x.min} max={x.max} step={x.step}
                                            onChange={(e) => handleSetData(x.name, e.target.value, x.type)} />
                                        <div className="secondary">[{x.min ?? "-∞"}, {x.max ?? "∞"}]</div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </Expandable>
            </div>

            <div className="md:mt-1 flex flex-row flex-wrap gap-1 [&>button]:px-4!">
                <button onClick={handleIsEnabledClick} className={isEnabled ? "active" : ""}>{isEnabled ? "⏽" : "⭘"}</button>
                <button onClick={handleToggleFavorite} className={isFavorited ? "active" : ""}>{isFavorited ? "♥︎" : "♡"}</button>
                <button onClick={(e) => handleMoveCommand(e, -1)} disabled={isTop}>&uarr;</button>
                <button onClick={(e) => handleMoveCommand(e, 1)} disabled={isBottom}>&darr;</button>
                <button onClick={handleRemoveCommand}>×</button>
            </div>
        </div>
    );
}
