'use client'
import {useComposedFileContext} from "@/app/provider/ComposedFileProvider";
import {Button, ScrollArea, Tabs} from "@mantine/core";
import {useState} from "react";
import {FilesList} from "@/app/ui/FilesList";
import {useFileContext} from "@/app/provider/FileProvider";
import {EditPrompts} from "@/app/ui/EditPrompts";
import {usePromptContext} from "@/app/provider/PromptProvider";
import {Analysis} from "@/app/ui/Analysis";
import {useAnalysisContext} from "@/app/provider/AnalysisProvider";

export function AnalyzeComposedFile() {

    const {composedFile} = useComposedFileContext();
    const {files, removeFile} = useFileContext();
    const {activePrompt} = usePromptContext();
    const {
        analysisText,
        buildAnalysisText,
        clearAnalysisText,
        analysisFileId,
        setAnalysisFileId,
        analysisStatus,
        setAnalysisStatus,
        model,
        temperature
    } = useAnalysisContext();

    const [activeTab, setActiveTab] = useState<string | null>("analysis");

    const uploadFile = async () => {
        if (!composedFile) return;
        setAnalysisStatus("uploading")
        const formData = new FormData();
        formData.append("file", composedFile);
        const response = await fetch("/api/file", {
            method: "POST",
            body: formData,
        });
        const json = await response.json();
        setAnalysisFileId(json.id);
        return json.id;
    }

    const deleteFile = async (id: string) => {
        if (!id) return;
        setAnalysisStatus("cleaning up")
        const formData = new FormData();
        formData.append("fileId", id);
        await fetch("/api/file", {
            method: "DELETE",
            body: formData,
        })
        setAnalysisStatus("completed");
        setAnalysisFileId(undefined);
    }

    const handelAIResponseStream = async (res: Response) => {
        if (!res.body) throw new Error("No response body");

        setAnalysisStatus("responding")
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, {stream: true});
            buildAnalysisText(chunk);
        }
    }

    const requestAI = async (id: string) => {
        if (!composedFile || !activePrompt || !id) return;
        setAnalysisStatus("analyzing");
        const formData = new FormData();
        formData.append("prompt", activePrompt.prompt);
        formData.append("fileId", id);
        formData.append("model", model);
        formData.append("temperature", temperature + "")
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                body: formData,
            });
            await handelAIResponseStream(res);
        } catch (e) {
            setAnalysisStatus("failed")
            throw new Error("AI request failed");
        } finally {
            setAnalysisStatus("completed")
        }
    }


    const handleCompose = async () => {
        setActiveTab("analysis");
        clearAnalysisText();
        const id = await uploadFile();
        if (!id) return;
        await requestAI(id);
        await deleteFile(id)
    }

    return (
        <div className="flex flex-col gap-2 w-full h-full mt-4 overflow-hidden">
            <div className="max-w-1/3 lg:w-1/3 mx-auto flex-shrink-0">
                <Button
                    disabled={composedFile === null || composedFile === undefined
                        || activePrompt === null || activePrompt === undefined
                        || analysisStatus === "analyzing" || analysisStatus === "responding" || analysisStatus === "uploading" || analysisStatus === "cleaning up"}
                    loading={analysisStatus === "analyzing" || analysisStatus === "responding" || analysisStatus === "uploading" || analysisStatus === "cleaning up"}
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
                    <EditPrompts/>
                </Tabs.Panel>
                <Tabs.Panel value="analysis" className="flex-1 flex h-full flex-col min-h-0 p-2">
                    <Analysis/>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}