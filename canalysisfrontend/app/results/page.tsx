'use client'

import {Card, Accordion, Chip, Spinner, Button} from "@heroui/react";
import {useAnalysis} from "@/app/context/AnalysisContext";
import {FileAnalysisResult} from "@/app/types/input";
import {IconArrowLeft} from "@tabler/icons-react";
import {useRouter, useSearchParams} from "next/navigation";
import {useMemo, Suspense} from "react";

function ResultsList() {
    const {results} = useAnalysis();
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileParam = searchParams.get('file');

    const filteredResults = useMemo(() => {
        if (!fileParam) return results;
        return results.filter(r => r.fileName === fileParam);
    }, [fileParam, results]);

    const getStatusChip = (status: FileAnalysisResult['status']) => {
        switch (status) {
            case 'running':
                return (
                    <Chip variant="soft" color="warning">
                        <div className="flex items-center gap-1">
                            <Spinner size="sm" color="current" />Analyzing...
                        </div>
                    </Chip>
                );
            case 'keywords_found':
                return (
                    <Chip variant="soft" color="success">
                        (keyword found)
                    </Chip>
                );
            case 'no_keywords_found_ai_search':
                return (
                    <Chip variant="primary">
                        (no keyword found, deep content analysis initiated)
                    </Chip>
                );
            case 'completed':
                return (
                    <Chip variant="soft" color="secondary">
                        (ai deep search)
                    </Chip>
                );
            case 'no_content_found':
                return (
                    <Chip variant="soft" color="danger">
                        (no content found)
                    </Chip>
                );
            case 'error':
                return (
                    <Chip variant="soft" color="danger">
                        Error
                    </Chip>
                );
            default:
                return <Chip variant="soft">Idle</Chip>;
        }
    };

    if (results.length === 0) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-xl text-default-500">No analysis results available.</p>
                <Button onPress={() => router.push('/')} variant="primary">
                    Back to Upload
                </Button>
            </div>
        );
    }

    if (fileParam && filteredResults.length === 0) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-xl text-default-500">Result for "{fileParam}" not found.</p>
                <Button onPress={() => router.push('/results')} variant="flat">
                    Show all results
                </Button>
            </div>
        );
    }

    return (
        <Card className="p-6">
            <Accordion variant="surface" defaultExpandedKeys={filteredResults.map((_, i) => i.toString())}>
                {filteredResults.map((result, index) => (
                    <Accordion.Item
                        id={index.toString()}
                        key={index}
                        aria-label={result.fileName}
                        title={
                            <div className="flex justify-between items-center w-full pr-4">
                                <span className="text-sm font-medium truncate max-w-[400px]">{result.fileName}</span>
                                {getStatusChip(result.status)}
                            </div>
                        }
                    >
                        <div className="p-2 flex flex-col gap-4 text-sm">
                            {result.status === 'running' && (
                                <div className="flex flex-col gap-2 items-center py-4">
                                    <Spinner size="md" color="warning"/>
                                    <p className="text-default-500 animate-pulse">Analyzing file...</p>
                                </div>
                            )}

                            {result.keywords.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-2">Found Keywords:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.keywords.map((k, i) => (
                                            <Chip key={i} size="sm" variant="secondary">
                                                {k.keyword} (Page {k.page === 0 ? 'N/A' : k.page})
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {result.aiResult && (
                                <div>
                                    <p className="font-semibold mb-1">AI Analysis Result:</p>
                                    <div
                                        className="bg-default-50 p-3 rounded-lg border border-default-200 whitespace-pre-wrap">
                                        {result.aiResult === "Nicht gefunden." ? (
                                            <span
                                                className="text-default-400 italic">No relevant content found by AI.</span>
                                        ) : (
                                            result.aiResult
                                        )}
                                    </div>
                                </div>
                            )}

                            {result.error && (
                                <div className="text-danger bg-danger-50 p-3 rounded-lg border border-danger-200">
                                    {result.error}
                                </div>
                            )}

                            {(result.status === 'completed' || result.status === 'no_content_found') && !result.aiResult && result.keywords.length === 0 && (
                                <p className="text-default-400 italic">Deep Search initiated: No keywords found by
                                    direct match.</p>
                            )}
                        </div>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Card>
    );
}

function PageHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileParam = searchParams.get('file');

    return (
        <div className="flex items-center gap-4">
            <Button onPress={() => router.push('/')} variant="ghost" isIconOnly aria-label="Back">
                <IconArrowLeft size={20}/>
            </Button>
            <h1 className="text-2xl font-bold">
                {fileParam ? `Analysis Result for ${fileParam}` : "Detailed Analysis Results"}
            </h1>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <div className="max-w-4xl mx-auto p-8 flex flex-col gap-6">
            <Suspense fallback={<div className="h-10 w-64 bg-default-100 animate-pulse rounded-lg"/>}>
                <PageHeader/>
            </Suspense>

            <Suspense fallback={<div className="flex justify-center p-20"><Spinner/></div>}>
                <ResultsList/>
            </Suspense>
        </div>
    );
}
