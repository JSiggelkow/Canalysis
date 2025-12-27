'use client'

import {Keyword} from "@/app/entity/Keyword";
import {createContext, ReactNode, useContext, useState} from "react";

interface KeywordContextType {
    keywords: Keyword[];
    addKeywords: (newKeywords: Keyword[]) => void;
    removeKeyword: (keywordToRemove: Keyword) => void;
    clearKeywords: () => void;
}

const KeywordContext = createContext<KeywordContextType>({} as KeywordContextType);

export function KeywordProvider({children}: {children: ReactNode}){

    const [keywords, setKeywords] = useState<Keyword[]>([]);

    const addKeywords = (newKeywords: Keyword[]) => {
            setKeywords((current) => {
                const existingIds = new Set(current.map(k => k.keyword));
                const uniqueNewKeywords = newKeywords.filter(k => !existingIds.has(k.keyword));
                return [...current, ...uniqueNewKeywords];
            });
        };

    const removeKeyword = (keywordToRemove: Keyword) => {
        setKeywords((current) => current.filter((k) => k !== keywordToRemove));
    };

    const clearKeywords = () => {
        setKeywords([]);
    }

    return (
        <KeywordContext.Provider value={{keywords, addKeywords, removeKeyword, clearKeywords}}>
            {children}
        </KeywordContext.Provider>
    )
}

export function useKeywordContext() {
    const context = useContext(KeywordContext);
    if (!context) {
        throw new Error('useKeywordContext must be used within a KeywordProvider');
    }
    return context;
}