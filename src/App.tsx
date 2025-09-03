import { useCallback } from 'react';
import './App.css'
import { Toaster } from 'react-hot-toast';
import { useDashboardContext } from './hooks/useCommandContext';
import ServerInput from './components/ServerInput';
import type { Command } from './types/command';
import useSseEndpoint from './hooks/useSseEndpoint';
import QuickCommands from './components/QuickCommands/QuickCommands';
import CommandList from './components/CommandList/CommandList';
import Favorites from './components/Favorites';

export default function App() {
    const { server, setCommands } = useDashboardContext();

    const handleServerCommandChange = useCallback((commands: Command[]) => {
        setCommands(commands);
    }, [setCommands]);

    useSseEndpoint(server, handleServerCommandChange);

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-4">
            <header>
                <div><Toaster /></div>
                <h1>maiswan/backlight</h1>
            </header>

            <main className="flex flex-col gap-y-1">
                <ServerInput />
                <QuickCommands />
                <Favorites />
                <CommandList />
            </main>
        </div>
    )
}