import { useCallback, useEffect, useState } from 'react';
import { ServerInput, ServerStatus, QuickCommands, FavoritesCommand } from './components'
import './App.css'
import { Toaster } from 'react-hot-toast';
import type { Instruction, InstructionTemplate } from './instructions/instructionSchema';
import { InstructionsContext } from './InstructionsContext';
import { v4 as uuidv4 } from 'uuid';

function App() {
    
    const [server, setServer] = useState(localStorage.getItem("server") ?? "");
    const [quickCommands, setQuickCommands] = useState<InstructionTemplate[]>(
        JSON.parse(localStorage.getItem("quickCommands") ?? "[]")
    );
    const [instructions, setInstructions] = useState<Instruction[]>([]);

    // localStorage writebacks
    useEffect(() => {
        localStorage.setItem("server", server);
    }, [server]);

    useEffect(() => {
        localStorage.setItem("quickCommands", JSON.stringify(quickCommands))
    }, [quickCommands])

    
    const addInstructionFromTemplate = useCallback((template: InstructionTemplate) => {
        const instruction: Instruction = {
            id: uuidv4(),
            z_index: 0,
            is_enabled: true,
            targets: null,
            ...template
        }

        setInstructions(prev => [...prev, instruction]);
    }, [setInstructions]);

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4">
            <div><Toaster /></div>
            <h1>Backlight Dashboard</h1>

            <ServerInput server={server} setServer={setServer} />
            <InstructionsContext.Provider value={{ instructions, setInstructions, quickCommands, setQuickCommands, addInstructionFromTemplate }}>
                <QuickCommands/>
                <FavoritesCommand/>
                <ServerStatus server={server}/>

            </InstructionsContext.Provider>

        </div>
    )
}

export default App
