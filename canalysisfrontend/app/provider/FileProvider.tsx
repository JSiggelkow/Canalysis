'use client'

import React, {createContext, useContext, useState, ReactNode} from 'react';

interface FileContextType {
    files: File[];
    addFiles: (newFiles: File[]) => void;
    removeFile: (filesToRemove: File) => void;
    clearFiles: () => void;
}

const FileContext = createContext<FileContextType>({} as FileContextType);

export function FileProvider({children}: { children: ReactNode }) {

    const [files, setFiles] = useState<File[]>([]);

    const addFiles = (newFiles: File[]) => {
            setFiles((current) => {
                const combinedFiles = [...current, ...newFiles];
                return combinedFiles.filter((file, index, self) =>
                    index === self.findIndex((t) => (
                        t.name === file.name
                    ))
                );
            });
        };

    const removeFile = (fileToDelete: File) => {
        setFiles((current) => current.filter((f) => f !== fileToDelete));
    };

    const clearFiles = () => {
        setFiles([]);
    };

    return (
        <FileContext.Provider value={{files, addFiles, removeFile, clearFiles}}>
            {children}
        </FileContext.Provider>
    );
}

export function useFileContext() {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
}