'use client'

import {KeywordSearchResult} from "@/app/entity/KeywordSearchResult";
import {createContext, ReactNode, useContext, useState} from "react";

interface ResultContextType {
    results: KeywordSearchResult[];
    addResult: (newResult: KeywordSearchResult) => void;
    removeResult: (resultToRemove: KeywordSearchResult) => void;
    clearResults: () => void;
}

const ResultContext = createContext<ResultContextType>({} as ResultContextType);

export function ResultProvider({children}: { children: ReactNode }) {

    const [results, setResults] = useState<KeywordSearchResult[]>([]);

    const addResult = (newResult: KeywordSearchResult) => {
        setResults((current) => [...current, newResult]);
    };
    const removeResult = (resultToRemove: KeywordSearchResult) => {
        setResults((current) => current.filter((r) => r !== resultToRemove));
    };
    const clearResults = () => {
        setResults([]);
    };

    return (
        <ResultContext.Provider value={{results, addResult, removeResult, clearResults}}>
            {children}
        </ResultContext.Provider>
    )
}

export function useResultContext() {
    const context = useContext(ResultContext);
    if (!context) {
        throw new Error('useResultContext must be used within a ResultProvider');
    }
    return context;
}