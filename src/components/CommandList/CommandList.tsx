import { Reorder } from "motion/react";
import { useDashboardContext } from "../../hooks/useCommandContext";
import Expandable from "../Expandable";
import CommandEntry from "./CommandEntry";
import { useCallback } from "react";
import useHttpEndpoint from "../../hooks/useHttpEndpoint";

export default function CommandList() {

    const { server, commands, setCommands, addCommandFromTemplate } = useDashboardContext();

    const moveCommand = useCallback((index: number, direction: 1 | -1) => {
        const swapIndex = index + direction;
        setCommands(prev => {
            const newCommands = [...prev];
            const temp = prev[swapIndex];
            newCommands[swapIndex] = newCommands[index];
            newCommands[index] = temp;
            return newCommands;
        });

    }, [setCommands]);

    const removeCommand = useCallback((id: string) => {
        setCommands(prev => prev.filter(x => x.id !== id));
    }, [setCommands])

    const addCommand = useCallback(() => {
        addCommandFromTemplate({
            mode: "gamma_static",
            targets: "",
        });
    }, [addCommandFromTemplate]);

    const { putCommands } = useHttpEndpoint(server);

    const applyCommands = useCallback(() => {
        putCommands(commands);
    }, [commands, putCommands]);

    return (
        <Expandable title="Commands" isInitiallyExpanded={true}>
            <p>Commands are applied from top to bottom.</p>

            <div className="[&_li]:mb-4 [&_li]:md:mb-1">
                <Reorder.Group values={commands} onReorder={setCommands}as="ol">
                {commands.map((x, index) =>
                    <Reorder.Item key={x.id} value={x}>
                        <CommandEntry command={x} isTop={index === 0} isBottom={index === commands.length - 1} index={index} moveCommand={moveCommand} removeCommand={removeCommand} />
                    </Reorder.Item>
                )}
            </Reorder.Group>
            </div>

            <div className="flex flex-row gap-x-1 mt-8 justify-end-safe items-center">
                <button onClick={applyCommands} className="flex-1 md:min-w-36">Apply</button>
                <button onClick={addCommand} className="flex-1 md:min-w-36">Add</button>
            </div>
        </Expandable>
    )
}
