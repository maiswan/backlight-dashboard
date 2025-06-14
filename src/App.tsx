import { useEffect, useState } from 'react';
import { ServerInput, ServerStatus, QuickCommands, FavoritesCommand } from './components'
import './App.css'
import { Toaster } from 'react-hot-toast';
import type { Instruction, InstructionTemplate } from './instructions/instructionSchema';

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

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4">
            <div><Toaster/></div>
            <h1>Backlight Dashboard</h1>

            <ServerInput server={server} setServer={setServer}/>
            <QuickCommands setInstructions={setInstructions}/>
            <FavoritesCommand quickCommands={quickCommands} setQuickCommands={setQuickCommands} setInstructions={setInstructions}/>
            <ServerStatus quickCommands={quickCommands} setQuickCommands={setQuickCommands} server={server} instructions={instructions} setInstructions={setInstructions}/>
        </div>
    )
}

export default App
