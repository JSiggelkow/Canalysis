'use client'

import React, {createContext, ReactNode, useContext, useState} from "react";
import {ComposeStatus} from "@/app/lib/ComposeFilesService";

interface ComposedFileContextType {
    composedFile?: File;
    composeStatus?: ComposeStatus;
    setComposeStatus: (newStatus: ComposeStatus) => void;
    setComposedFile: (newFile: File) => void;
    clearComposeStatus: () => void;
    clearComposedFile: () => void;
}

const ComposedFileContext = createContext<ComposedFileContextType>({} as ComposedFileContextType);

export function ComposedFileProvider({children}: { children: ReactNode }) {

    const [composedFile, setComposedFile] = useState<File>();
    const [composeStatus, setComposeStatus] = useState<ComposeStatus>();

    const clearComposedFile = () => {
        setComposedFile(undefined);
    }

    const clearComposeStatus = () => {
        setComposeStatus(undefined);
    }


    return(
        <ComposedFileContext.Provider value={{composedFile, composeStatus, setComposeStatus, clearComposeStatus, setComposedFile, clearComposedFile}}>
            {children}
        </ComposedFileContext.Provider>
    )

}

export function useComposedFileContext() {
    const context = useContext(ComposedFileContext);
    if (!context) {
        throw new Error('useComposedFileContext must be used within a ComposedFileProvider');
    }
    return context;
}