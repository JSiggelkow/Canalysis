'use client'

import React, {useState} from "react";
import {
    Button,
    Card,
    Chip,
    Input,
    ScrollShadow,
    TextArea,
    CloseButton,
    Tabs
} from "@heroui/react";
import {useAnalysis} from "@/app/context/AnalysisContext";
import {IconPlus, IconArrowLeft} from "@tabler/icons-react";
import {useRouter} from "next/navigation";

function KeywordManager() {
    const {keywords, setKeywords} = useAnalysis();
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
                    fullWidth={true}
                    placeholder="Add new keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    isIconOnly
                    size="sm"
                    variant="primary"
                    onPress={addKeyword}
                >
                    <IconPlus size={18}/>
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
                                color="default"
                                size="sm"
                            >
                                {keyword}
                                <CloseButton onPress={() => removeKeyword(keyword)} aria-label="Remove keyword"/>
                            </Chip>
                        ))
                    )}
                </div>
            </ScrollShadow>
        </Card>
    );
}

function PromptManager() {
    const {prompts, setPrompts, selectedPromptId, setSelectedPromptId} = useAnalysis();
    const selectedPrompt = prompts.find(p => p.id === selectedPromptId);
    const [isChanged, setChanged] = useState(false);

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChanged(true);
        setPrompts(prompts.map(p =>
            p.id === selectedPromptId ? {...p, content: e.target.value} : p
        ));
    };

    const saveChanges = () => {
        setChanged(false);
    }


    return (
        <Card className="p-4 flex flex-col h-full overflow-y-auto min-h-0">
            <div className="flex flex-col gap-4 h-full">
                <div className="flex flex-col gap-2 flex-shrink-0 items-center">
                    <Tabs className={"w-full max-w-md"}>
                        <Tabs.List aria-label="Prompts">
                            <Tabs.Tab id="german" onPress={() => setSelectedPromptId(prompts[0].id)}>
                                German
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="english" onPress={() => setSelectedPromptId(prompts[1].id)}>
                                English
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel className="pt-4" id="german">
                            <TextArea
                                aria-label="Change German Prompt"
                                value={selectedPrompt?.content ?? ""}
                                onChange={handleContentChange}
                                fullWidth={true}
                                rows={30}
                            />
                        </Tabs.Panel>
                        <Tabs.Panel className="pt-4" id="english">
                            <TextArea
                                aria-label="Change English Prompt"
                                value={selectedPrompt?.content ?? ""}
                                onChange={handleContentChange}
                                fullWidth={true}
                                rows={30}
                            />

                        </Tabs.Panel>
                    </Tabs>
                    <Button variant="primary" size="lg" className="flex-shrink-0 w-100" onPress={saveChanges}
                            isDisabled={!isChanged}>Save</Button>
                </div>
            </div>
        </Card>
    );
}

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className="w-screen h-screen flex flex-col p-2 overflow-hidden bg-default-50">
            <div className="max-w-7xl w-full mx-auto flex flex-col h-full gap-6">
                <div className="flex items-center gap-4">
                    <Button onPress={() => router.push('/')} variant="ghost" isIconOnly aria-label="Back">
                        <IconArrowLeft size={20}/>
                    </Button>
                    <h1 className="text-2xl font-bold">Analysis Settings</h1>
                </div>

                <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                    <div className="lg:col-span-2 h-full min-h-0">
                        <KeywordManager/>
                    </div>
                    <div className="lg:col-span-2 h-full min-h-0">
                        <PromptManager/>
                    </div>
                </div>
            </div>
        </div>
    );
}