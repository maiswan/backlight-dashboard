import { useCallback, useState, type MouseEvent, type ReactNode, } from "react";
import { Collapse } from 'react-collapse';

interface ExpandableProps {
    isInitiallyExpanded?: boolean,
    title: ReactNode,
    children: ReactNode,
}

export default function Expandable({ isInitiallyExpanded = true, title, children }: ExpandableProps) {

    const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

    const toggle = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <div>
            <button onClick={toggle} className="p-0! w-full! max-w-full! rounded-none!">
            <div className="px-4! py-2! bg-stone-500/50 flex flex-row text-left items-center">
                <div className="flex-1">{typeof title === "string" ? <h2>{title}</h2> : title}</div>
                <div className={`ml-4 mr-2 transform duration-200 ${isExpanded && "rotate-180"}`}>▲</div>
            </div>
            </button>
            <div className={`px-4 transform duration-200 border-x-1 border-stone-500 ${isExpanded ? "py-4 border-b-1" : ""}`}>
                <Collapse isOpened={isExpanded}>
                    {isExpanded && children}
                </Collapse>
            </div>
        </div>
    );
}