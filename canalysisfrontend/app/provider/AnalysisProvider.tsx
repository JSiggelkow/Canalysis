'use client'

import {createContext, ReactNode, useContext, useState} from "react";

interface AnalysisContextType {
    analysisText: string;
    buildAnalysisText: (newText: string) => void;
    clearAnalysisText: () => void;
    analysisStatus: 'off' | 'uploading' | 'analyzing' | 'responding' | 'cleaning up' | 'completed' | 'failed';
    setAnalysisStatus: (newStatus: 'off' | 'uploading' | 'analyzing' | 'responding' | 'cleaning up' | 'completed' | 'failed') => void;
    analysisFileId: string | undefined;
    setAnalysisFileId: (newFileId: string | undefined) => void;
    model: string;
    setModel: (newModel: string) => void;
    temperature: number;
    setTemperature: (newTemperature: number) => void;
}

const AnalysisContext = createContext<AnalysisContextType>({} as AnalysisContextType);

export function AnalysisProvider({children}: {children: ReactNode}) {
    const [analysisText, setAnalysisText] = useState('');
    const [analysisStatus, setAnalysisStatus] = useState<'off' | 'uploading' | 'analyzing' | 'responding' | 'cleaning up' | 'completed' | 'failed'>('off');
    const [analysisFileId, setAnalysisFileId] = useState<string | undefined>('');
    const [model, setModel] = useState('gpt-5.2');
    const [temperature, setTemperature] = useState(0.1);

    const clearAnalysisText = () => {
        setAnalysisText('');
    }

    const buildAnalysisText = (newText: string) => {
        setAnalysisText((current) => current + newText);
    }

    return (
        <AnalysisContext.Provider value={{analysisText, buildAnalysisText, clearAnalysisText, analysisStatus, setAnalysisStatus, analysisFileId, setAnalysisFileId, model, setModel, temperature, setTemperature}}>
            {children}
        </AnalysisContext.Provider>
    )
}

export function useAnalysisContext() {
    const context = useContext(AnalysisContext);
    if (!context) {
        throw new Error('useAnalysisContext must be used within a AnalysisProvider');
    }
    return context;
}