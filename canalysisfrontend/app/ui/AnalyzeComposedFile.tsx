'use client'
import {useComposedFileContext} from "@/app/provider/ComposedFileProvider";
import {Button, ScrollArea, Tabs} from "@mantine/core";
import {useState} from "react";
import {FilesList} from "@/app/ui/FilesList";
import {useFileContext} from "@/app/provider/FileProvider";
import {EditPrompts} from "@/app/ui/EditPrompts";
import {Prompt} from "@/app/entity/Prompt";
import {usePromptContext} from "@/app/provider/PromptProvider";

export function AnalyzeComposedFile() {

    const {composedFile} = useComposedFileContext();
    const {files, removeFile} = useFileContext();
    const {activePrompt} = usePromptContext();

    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string | null>("prompts");

    const handleCompose = async () => {
        setIsAnalyzing(true);
    }

    return (
        <div className="flex flex-col gap-2 w-full h-full mt-4 overflow-hidden">
            <div className="max-w-1/3 lg:w-1/3 mx-auto flex-shrink-0">
                <Button
                    disabled={composedFile === null || composedFile === undefined || activePrompt === null || activePrompt === undefined}
                    loading={isAnalyzing}
                    onClick={handleCompose}
                    size="xl"
                    fullWidth>
                    start analysis
                </Button>
            </div>
            <Tabs value={activeTab} onChange={setActiveTab} className="flex-1 flex flex-col min-h-0 h-full"
                  variant="outline" radius="md">
                <Tabs.List justify="center">
                    <Tabs.Tab value="files">files</Tabs.Tab>
                    <Tabs.Tab value="prompts">prompts</Tabs.Tab>
                    <Tabs.Tab value="analysis">analysis</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="files" className="flex-1 flex flex-col h-full min-h-0 p-4">
                    <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl p-2">
                        <FilesList files={files} removeFile={removeFile}/>
                    </ScrollArea>
                </Tabs.Panel>
                <Tabs.Panel value="prompts" className="flex-1 flex flex-col h-full min-h-0 p-4">
                    <EditPrompts />
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}