'use client'

import { useState } from "react";
import { Button, Card, Chip, Input, ScrollShadow, TextArea, Select, Label, ListBox } from "@heroui/react";
import { useAnalysis, Prompt } from "@/app/context/AnalysisContext";
import { IconPlus, IconTrash, IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

function KeywordManager() {
    const { keywords, setKeywords } = useAnalysis();
    const [newKeyword, setNewKeyword] = useState("");

    const addKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword("");
        }
    };

    const removeKeyword = (keywordToRemove: string) => {
        setKeywords(keywords.filter(k => k !== keywordToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addKeyword();
        }
    };

    return (
        <Card className="p-4 flex flex-col h-full overflow-hidden min-h-0">
            <h3 className="text-md font-semibold mb-4 flex-shrink-0">Analysis Keywords</h3>
            
            <div className="flex gap-2 mb-4 flex-shrink-0">
                <Input
                    size="sm"
                    placeholder="Add new keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button 
                    isIconOnly 
                    size="sm" 
                    variant="flat" 
                    color="primary"
                    onPress={addKeyword}
                >
                    <IconPlus size={18} />
                </Button>
            </div>

            <ScrollShadow className="flex-grow min-h-0 pr-2">
                <div className="flex flex-wrap gap-2">
                    {keywords.length === 0 ? (
                        <p className="text-default-400 text-center py-4 text-xs italic w-full">No keywords defined</p>
                    ) : (
                        keywords.map((keyword, index) => (
                            <Chip 
                                key={index}
                                variant="flat"
                                color="default"
                                size="sm"
                                onClose={() => removeKeyword(keyword)}
                                className="pl-2"
                            >
                                {keyword}
                            </Chip>
                        ))
                    )}
                </div>
            </ScrollShadow>
        </Card>
    );
}

function PromptManager() {
    const { prompts, setPrompts, selectedPromptId, setSelectedPromptId } = useAnalysis();
    const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editLanguage, setEditLanguage] = useState<'de' | 'en' | 'custom'>('custom');

    const selectedPrompt = prompts.find(p => p.id === selectedPromptId);

    const startEditing = (prompt: Prompt) => {
        setEditingPromptId(prompt.id);
        setEditName(prompt.name);
        setEditContent(prompt.content);
        setEditLanguage(prompt.language);
    };

    const savePrompt = () => {
        if (!editName.trim() || !editContent.trim()) return;

        setPrompts(prompts.map(p => p.id === editingPromptId ? {
            ...p,
            name: editName,
            content: editContent,
            language: editLanguage
        } : p));
        setEditingPromptId(null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-0">
            {/* Sidebar: List of Prompts */}
            <Card className="p-4 flex flex-col h-full overflow-hidden min-h-0">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-md font-semibold">Prompts</h3>
                </div>
                <ScrollShadow className="flex-grow min-h-0">
                    <ListBox 
                        aria-label="Prompts"
                        className="w-full"
                        selectionMode="single"
                        selectedKeys={new Set([selectedPromptId])}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string;
                            if (selected) setSelectedPromptId(selected);
                        }}
                    >
                        {prompts.map((prompt) => (
                            <ListBox.Item 
                                id={prompt.id} 
                                key={prompt.id}
                                textValue={prompt.name}
                            >
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{prompt.name}</span>
                                        <span className="text-tiny text-default-400">{prompt.language}</span>
                                    </div>
                                </div>
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </ScrollShadow>
            </Card>

            {/* Main Area: Edit/View Prompt */}
            <Card className="col-span-1 md:col-span-2 p-4 flex flex-col h-full overflow-hidden min-h-0">
                {editingPromptId ? (
                    <div className="flex flex-col gap-4 h-full">
                        <div className="flex justify-between items-center">
                            <h3 className="text-md font-semibold">
                                Edit Prompt
                            </h3>
                            <div className="flex gap-2">
                                <Button size="sm" variant="flat" onPress={() => setEditingPromptId(null)}>Cancel</Button>
                                <Button size="sm" color="primary" onPress={savePrompt} startContent={<IconDeviceFloppy size={16}/>}>Save</Button>
                            </div>
                        </div>
                        <Input 
                            label="Name" 
                            placeholder="Prompt name" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                        />
                        <div className="flex-grow flex flex-col min-h-0">
                            <p className="text-tiny text-default-500 mb-1">Use {"{{keywords}}"} as a placeholder for the keyword list.</p>
                            <TextArea
                                label="Content"
                                placeholder="Enter prompt instructions..."
                                className="flex-grow"
                                classNames={{
                                    innerWrapper: "h-full",
                                    input: "h-full"
                                }}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        </div>
                    </div>
                ) : selectedPrompt ? (
                    <div className="flex flex-col gap-4 h-full">
                        <div className="flex justify-between items-center">
                            <h3 className="text-md font-semibold">{selectedPrompt.name}</h3>
                            <Button 
                                size="sm" 
                                variant="flat" 
                                color="primary" 
                                onPress={() => startEditing(selectedPrompt)}
                            >
                                Edit Prompt
                            </Button>
                        </div>
                        <div className="flex-grow overflow-y-auto bg-default-50 p-4 rounded-lg border border-default-200 whitespace-pre-wrap text-sm">
                            {selectedPrompt.content}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-default-400 italic">
                        Select a prompt to view or edit
                    </div>
                )}
            </Card>
        </div>
    );
}

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className="w-screen h-screen flex flex-col p-8 overflow-hidden bg-default-50">
            <div className="max-w-7xl w-full mx-auto flex flex-col h-full gap-6">
                <div className="flex items-center gap-4">
                    <Button onPress={() => router.push('/')} variant="ghost" isIconOnly aria-label="Back">
                        <IconArrowLeft size={20}/>
                    </Button>
                    <h1 className="text-2xl font-bold">Analysis Settings</h1>
                </div>

                <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                    <div className="lg:col-span-1 h-full min-h-0">
                        <KeywordManager />
                    </div>
                    <div className="lg:col-span-3 h-full min-h-0">
                        <PromptManager />
                    </div>
                </div>
            </div>
        </div>
    );
}