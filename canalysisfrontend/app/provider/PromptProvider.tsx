'use client'

import {Prompt} from "@/app/entity/Prompt";
import {createContext, ReactNode, useContext, useState} from "react";

interface PromptContextType {
    prompts: Prompt[];
    addPrompt: (newPrompt: Prompt) => void;
    removePrompt: (promptToRemove: Prompt) => void;
    clearPrompts: () => void;
    activePrompt?: Prompt | null;
    setActivePrompt: (prompt: Prompt | null) => void;
}

const PromptContext = createContext<PromptContextType>({} as PromptContextType);

export function PromptProvider({children}: { children: ReactNode }) {

    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);

    const addPrompt = (newPrompt: Prompt) => {
        setPrompts((current) => {
            if (current.some(p => p.id === newPrompt.id)) return current;
            return [...current, newPrompt];
        });
    }

    const removePrompt = (promptToRemove: Prompt) => {
        setPrompts((current) => current.filter((p) => p !== promptToRemove));
    }

    const clearPrompts = () => {
        setPrompts([]);
    }


    return (
        <PromptContext.Provider value={{
            prompts,
            addPrompt,
            removePrompt,
            clearPrompts,
            activePrompt,
            setActivePrompt
        }}>
            {children}
        </PromptContext.Provider>
    )
}

export function usePromptContext() {
    const context = useContext(PromptContext);
    if (!context) {
        throw new Error('usePromptContext must be used within a PromptProvider');
    }
    return context;
}