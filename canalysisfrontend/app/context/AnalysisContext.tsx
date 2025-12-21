'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FileAnalysisResult } from '@/app/types/input';

export interface Prompt {
    id: string;
    name: string;
    content: string;
    language: 'de' | 'en' | 'custom';
}

interface AnalysisContextType {
    results: FileAnalysisResult[];
    setResults: React.Dispatch<React.SetStateAction<FileAnalysisResult[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    currentFile: string | null;
    setCurrentFile: React.Dispatch<React.SetStateAction<string | null>>;
    keywords: string[];
    setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
    prompts: Prompt[];
    setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
    selectedPromptId: string;
    setSelectedPromptId: React.Dispatch<React.SetStateAction<string>>;
}

const DEFAULT_KEYWORDS = [
    "Multilingualismus", "Mehrsprachigkeit", "Zweisprachigkeit", "sprachliche Vielfalt",
    "sprachliche Heterogenität", "Zweitspracherwerb", "sprachliche Diversität",
    "Deutsch als Zweitsprache", "weitere Sprachen", "Drittsprachen",
    "Sprachbewusstsein", "Herkunftssprachen", "Sprachmittlung", "Plurilingualismus"
];

const DEFAULT_PROMPTS: Prompt[] = [
    {
        id: 'default-de',
        name: 'German Default',
        language: 'de',
        content: `Sie analysieren ein Lehrplan-Dokument in deutscher Sprache im Rahmen einer wissenschaftlichen Studie darüber, wie Mehrsprachigkeit in Lehramtsstudiengängen behandelt wird. Konzentrieren Sie sich dabei ausschließlich darauf, was angehenden Lehrkräften über Mehrsprachigkeit, sprachliche Vielfalt oder die Arbeit mit mehrsprachigen Schülern vermittelt wird. 
Analysieren Sie nicht die Unterrichtssprache, die mehrsprachige Gestaltung des Programms oder die Sprache der Prüfungen. Suchen Sie sowohl nach expliziten Erwähnungen als auch nach impliziten Verweisen in deutscher Sprache auf die folgenden Begriffe oder verwandte Konzepte: 
{{keywords}}. 
Wenn keine relevanten Inhalte gefunden werden, geben Sie bitte genau Folgendes an: "Nicht gefunden." Wenn relevante Inhalte gefunden werden, geben Sie bitte nur den genauen Ausdruck in der Originalsprache zusammen mit der Seitenzahl oder dem Abschnittsverweis an. Fügen Sie keine Zusammenfassungen, Erklärungen, Übersetzungen, Interpretationen hinzu.`
    },
    {
        id: 'default-en',
        name: 'English Default',
        language: 'en',
        content: `You are analyzing a curriculum document written in English as part of an academic study on how multilingualism is addressed in teacher education programs.
Focus strictly on what pre-service teachers are taught about multilingualism, linguistic diversity, or working with multilingual students. Do not analyze the language of instruction, the multilingual design of the program, or the language of examinations.
Search for both explicit mentions and implicit references, in English, to the following terms or related concepts: 
{{keywords}}.

If no relevant content is found, return exactly: Not found.
If relevant content is found, return only the exact phrase found in the original language, along with the page number or section reference. Do not provide summaries, explanations, translations, or interpretations.`
    }
];

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
    const [results, setResults] = useState<FileAnalysisResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [keywords, setKeywords] = useState<string[]>(DEFAULT_KEYWORDS);
    const [prompts, setPrompts] = useState<Prompt[]>(DEFAULT_PROMPTS);
    const [selectedPromptId, setSelectedPromptId] = useState<string>('default-de');

    return (
        <AnalysisContext.Provider value={{ 
            results, setResults, 
            loading, setLoading, 
            currentFile, setCurrentFile,
            keywords, setKeywords,
            prompts, setPrompts,
            selectedPromptId, setSelectedPromptId
        }}>
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysis() {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
}
