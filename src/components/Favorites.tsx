import { useCallback } from "react";
import { useDashboardContext } from "../hooks/useCommandContext";
import { CommandSchema, type CommandTemplate } from "../types/command";
import Expandable from "./Expandable";

// Retrieve only the parameters (e.g., r,g,b from a color_static_rgb) from a CommandTemplate
function trimParametersFromCommandTemplate(template: CommandTemplate) {
    const mode = template.mode;
    const keys = CommandSchema[mode];
    const parameters = template as Record<string, unknown>;

    return keys.map(x => [x.name, parameters[x.name]]);
}

export default function Favorites() {

    const { favoriteCommands, addCommandFromTemplate, setFavoriteCommands } = useDashboardContext();

    const remove = useCallback((index: number) => {
        setFavoriteCommands(prev => {
            return [...prev].splice(index, 1);
        });
    }, [setFavoriteCommands]);

    return (
        <Expandable title="Favorites" isInitiallyExpanded={true}>
            <div className="flex flex-row flex-wrap gap-1">
                {
                    favoriteCommands.map((x, index) =>
                        <div key={index} className="flex flex-row items-stretch">
                            <button onClick={() => addCommandFromTemplate(x)} className="rounded-none! rounded-l-md! py-2! px-2! md:px-4! font-mono max-w-none! break-all">
                                {x.mode}(
                                <span className="secondary">
                                {
                                    trimParametersFromCommandTemplate(x).map(x => `${x[0]}=${x[1]}`).join(", ")
                                }
                                </span>    
                                )
                            </button>
                            <button onClick={() => remove(index)} className="rounded-none! rounded-r-md! py-2! px-2! md:px-4! min-w-12!">⨯</button>
                        </div>
                    )
                }
            </div>
        </Expandable>
    )
}
