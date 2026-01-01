'use client'

import {
    Accordion,
    Badge,
    Button,
    Card,
    Group,
    List,
    rem, RingProgress,
    ScrollArea,
    SemiCircleProgress,
    Tabs,
    Text,
    ThemeIcon
} from "@mantine/core";
import {useState} from "react";
import {IconCheck, IconDownload, IconFileText, IconX} from "@tabler/icons-react";
import {useResultContext} from "@/app/provider/ResultProvider";
import {composeFilesService} from "@/app/lib/ComposeFilesService";
import {ComposeStatus} from "@/app/entity/ComposeStatus";
import {useComposedFileContext} from "@/app/provider/ComposedFileProvider";
import {KeywordSearchResultList} from "@/app/ui/KeywordSearchResultList";
import {FilesList} from "@/app/ui/FilesList";
import {useFileContext} from "@/app/provider/FileProvider";

export function ComposeFiles() {

    const {results} = useResultContext();
    const {files, removeFile} = useFileContext();
    const {composedFile, setComposedFile, composeStatus, setComposeStatus} = useComposedFileContext();

    const [activeTab, setActiveTab] = useState<string | null>(composeStatus != undefined ? "Composed Files" : "Files to Compose");
    const [isComposing, setIsComposing] = useState<boolean>(false);

    const handleCompose = async () => {
        setIsComposing(true);
        setActiveTab("Composed Files");
        try {
            const file = await composeFilesService(results.filter(r => r.matches.length > 0), (currentStatus: ComposeStatus) => {
                setComposeStatus(currentStatus);
            });
            setComposedFile(file)
        } catch (e) {
            console.error(e);
        } finally {
            setIsComposing(false);
        }
    }

    const downloadFile = () => {
        if (composedFile === null || composedFile === undefined) return;
        const file = composedFile;
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex flex-col gap-2 w-full h-full mt-4 overflow-hidden">
            <div className="max-w-1/3 lg:w-1/3 mx-auto flex-shrink-0">
                <Button
                    loading={isComposing}
                    onClick={handleCompose}
                    size="xl"
                    fullWidth>
                    Compose
                </Button>
            </div>

            <Tabs value={activeTab} onChange={setActiveTab} className="flex-1 flex flex-col min-h-0 h-full"
                  variant="outline" radius="md">
                <Tabs.List justify="center">
                    <Tabs.Tab value="files">files</Tabs.Tab>
                    <Tabs.Tab value="Files to Compose">Files to Compose</Tabs.Tab>
                    <Tabs.Tab value="Composed Files">Composed File</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="files" className="flex-1 flex flex-col h-full min-h-0 p-4">
                    <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl p-2">
                        <FilesList files={files} removeFile={removeFile}/>
                    </ScrollArea>
                </Tabs.Panel>
                <Tabs.Panel value="Files to Compose" className="flex-1 flex flex-col h-full min-h-0 pt-4">
                    <KeywordSearchResultList preSetOnlyMatches={true}/>
                </Tabs.Panel>
                <Tabs.Panel value="Composed Files" className="flex-1 flex h-full flex-col min-h-0 p-2">
                    <div className="flex-shrink-0 min-h-0 w-full xl:w-4xl lg:w-2xl mx-auto m-2">
                        <Card shadow="sm" radius="md" p="xl">
                            <Card.Section>
                                <Group justify="space-between" mb="xs">
                                    <div className="flex flex-row gap-2">
                                        <IconFileText size={24} className="text-gray-500"/>
                                        <Text w={600} truncate="end">{
                                            isComposing && composeStatus ? "Composing File: " + composeStatus.currentFileName :
                                                !isComposing && composeStatus && composeStatus.status === "completed" ? "Created: " + composedFile?.name : "Click Compose to start composing files."
                                        }</Text>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <Badge
                                            color={
                                                composeStatus?.status === "initializing" ? 'indigo' :
                                                    composeStatus?.status === "processing" ? 'blue' :
                                                        composeStatus?.status === "saving" ? 'yellow' :
                                                            composeStatus?.status === "completed" ? 'green' : 'gray'
                                            }
                                        >{composeStatus?.status || "off"}</Badge>
                                    </div>
                                </Group>
                                <Group justify="space-evenly">
                                    <SemiCircleProgress
                                        fillDirection="left-to-right"
                                        orientation="up"
                                        filledSegmentColor="blue"
                                        size={200}
                                        thickness={12}
                                        value={composeStatus ? composeStatus.processedFilesCount / composeStatus.totalFilesCount * 100 : 0}
                                        labelPosition="center"
                                        label={`${composeStatus?.processedFilesCount || 0} / ${composeStatus?.totalFilesCount || 0} composed`}>
                                    </SemiCircleProgress>
                                    <RingProgress
                                        size={120}
                                        thickness={12}
                                        label={
                                            <Text size="md" ta="center" px="xs" style={{pointerEvents: "none"}}>
                                                Pages
                                            </Text>
                                        }
                                        sections={[
                                            {
                                                value: composeStatus && composeStatus.totalPagesCount > 0
                                                    ? (composeStatus.totalPagesAdded / composeStatus.totalPagesCount) * 100
                                                    : 0,
                                                color: 'blue',
                                                tooltip: 'Pages added - ' + (composeStatus?.totalPagesAdded || 0)
                                            },
                                            {
                                                value: composeStatus && composeStatus.totalPagesCount > 0
                                                    ? ((composeStatus.totalPagesCount - composeStatus.totalPagesAdded) / composeStatus.totalPagesCount) * 100
                                                    : 0,
                                                color: 'gray',
                                                tooltip: 'Pages skipped - ' + (composeStatus ? composeStatus.totalPagesCount - composeStatus.totalPagesAdded : 0)
                                            }
                                        ]}></RingProgress>
                                </Group>
                                <Group justify="center" mt="md">
                                    <Button
                                        disabled={composeStatus?.status !== "completed" || isComposing || !composeStatus}
                                        onClick={() => downloadFile()}
                                        rightSection={<IconDownload size={18}/>}
                                    >Download</Button>

                                </Group>
                            </Card.Section>
                        </Card>
                    </div>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}