'use client'

import {Button, Card, Chip, Spinner} from "@heroui/react";
import {analyzeFileAction} from "@/app/actions/analyze";
import {FileAnalysisResult} from "@/app/types/input";
import {useAnalysis} from "@/app/context/AnalysisContext";
import Link from "next/link";

interface AnalysisProps {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function StartAnalysisButton({ files, setFiles }: AnalysisProps) {
    const { setResults, loading, setLoading, setCurrentFile, keywords, prompts, selectedPromptId } = useAnalysis();

    const handleAnalysis = async () => {
        if (files.length === 0) {
            alert("Please select files first.");
            return;
        }

        const selectedPrompt = prompts.find(p => p.id === selectedPromptId);
        if (!selectedPrompt) {
            alert("Please select a prompt in settings.");
            return;
        }

        setLoading(true);
        console.log(`Starting analysis for ${files.length} files with ${keywords.length} keywords and prompt "${selectedPrompt.name}"...`);

        const filesToAnalyze = [...files];

        for (const file of filesToAnalyze) {
            setCurrentFile(file.name);
            
            setResults(prev => [...prev, {
                fileName: file.name,
                status: 'running',
                keywords: []
            }]);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("keywords", JSON.stringify(keywords));
            formData.append("prompt", selectedPrompt.content);
            formData.append("promptLanguage", selectedPrompt.language);

            if (file.webkitRelativePath) {
                formData.append("filePath", file.webkitRelativePath);
            }

            try {
                const result = await analyzeFileAction(formData);
                
                setResults(prev => prev.map(res => 
                    res.fileName === file.name ? result : res
                ));

                setFiles(prev => prev.filter(f => f !== file));
            } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : "Error during analysis";
                console.error(`Error with ${file.name}:`, e);
                setResults(prev => prev.map(res => 
                    res.fileName === file.name ? {
                        fileName: file.name,
                        status: 'error',
                        keywords: [],
                        error: errorMessage
                    } : res
                ));
                setFiles(prev => prev.filter(f => f !== file));
            }
        }

        setLoading(false);
        setCurrentFile(null);
    };

    return (
        <Button
            onPress={handleAnalysis}
            isPending={loading}
            isDisabled={files.length === 0}
            variant="primary"
            size="lg"
            className="w-full flex-shrink-0"
        >
            Start Analysis ({files.length})
        </Button>
    );
}

export function AnalysisHistory() {
    const { results, loading } = useAnalysis();

    const getStatusChip = (status: FileAnalysisResult['status']) => {
        switch (status) {
            case 'running':
                return (
                    <Chip variant="soft" color="warning" size="sm">
                        <div className="flex items-center gap-1">
                            <Spinner size="sm" color="current" />
                        </div>
                    </Chip>
                );
            case 'keywords_found':
                return (
                    <Chip variant="soft" color="success" size="sm">
                        (keyword found)
                    </Chip>
                );
            case 'no_keywords_found_ai_search':
                return (
                    <Chip variant="soft" color="accent" size="sm">
                        (no keyword found, deep content analysis initiated)
                    </Chip>
                );
            case 'completed':
                return (
                    <Chip variant="soft" color="accent" size="sm">
                        (ai deep search)
                    </Chip>
                );
            case 'no_content_found':
                return (
                    <Chip variant="soft" color="danger" size="sm">
                        (no content found)
                    </Chip>
                );
            case 'error':
                return (
                    <Chip variant="soft" color="danger" size="sm">
                        Error
                    </Chip>
                );
            default:
                return <Chip variant="soft" size="sm">Idle</Chip>;
        }
    };

    return (
        <Card className="p-4 flex flex-col h-full overflow-hidden min-h-0">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="text-md font-semibold">Analysis History</h3>
                {loading && <Spinner size="sm" color="warning" />}
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto mb-4 flex-grow min-h-0 pr-2">
                {results.length === 0 ? (
                    <p className="text-default-400 text-center py-10 text-xs italic">No analyses started yet</p>
                ) : (
                    results.map((result, index) => (
                        <Link 
                            key={index} 
                            href={`/results?file=${encodeURIComponent(result.fileName)}`}
                            className="flex justify-between items-center bg-default-50 p-2 rounded-lg border border-default-100 flex-shrink-0 hover:bg-default-100 transition-colors cursor-pointer"
                        >
                            <span className="text-xs truncate max-w-[180px]">{result.fileName}</span>
                            {getStatusChip(result.status)}
                        </Link>
                    ))
                )}
            </div>

        </Card>
    );
}

export default function AnalysisButton({files, setFiles}: AnalysisProps) {
    return (
        <div className="flex flex-col gap-6 w-full h-full">
            <StartAnalysisButton files={files} setFiles={setFiles} />
            <AnalysisHistory />
        </div>
    );
}