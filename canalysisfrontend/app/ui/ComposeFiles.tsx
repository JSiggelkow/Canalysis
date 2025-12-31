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

export function ComposeFiles() {

    const {results} = useResultContext();
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
                    <Tabs.Tab value="Files to Compose">Files to Compose</Tabs.Tab>
                    <Tabs.Tab value="Composed Files">Composed File</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="Files to Compose" className="flex-1 flex flex-col h-full min-h-0 pt-4">
                    <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl p-2">
                        <Accordion variant="separated" radius="md" className="pb-8">
                            {results.filter((r) => r.matches.length > 0).map((result) => (
                                <Accordion.Item key={result.fileName} value={result.fileName}>
                                    <Accordion.Control icon={
                                        <ThemeIcon color={result.matches.length > 0 ? 'teal' : 'gray'} variant="light"
                                                   size="lg">
                                            {result.matches.length > 0 ?
                                                <IconCheck style={{width: rem(20), height: rem(20)}}/> :
                                                <IconX style={{width: rem(20), height: rem(20)}}/>}
                                        </ThemeIcon>
                                    }>
                                        <Group justify="space-between" wrap="nowrap">
                                            <Group gap="xs" wrap="nowrap">
                                                <IconFileText size={16} className="text-gray-500"/>
                                                <Text truncate="end" w={300} fw={500}>{result.fileName}</Text>
                                            </Group>
                                            {result.matches.length > 0 && <Badge color="teal"
                                                                                 variant="light">{result.matches.length} Matches</Badge>}
                                        </Group>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        {result.matches.length > 0 ? (
                                            <List spacing="xs" size="sm" p={10} center icon={
                                                <ThemeIcon color="teal" size={24} radius="xl">
                                                    <IconCheck style={{width: rem(12), height: rem(12)}}/>
                                                </ThemeIcon>
                                            }>
                                                {result.matches.map((match, idx) => (
                                                    <List.Item key={idx}>
                                                        <Group gap="xs">
                                                            <Text fw={700}>{match.keyword}</Text>
                                                            <Text size="xs" c="dimmed">found on
                                                                pages: {match.pages.join(', ')}</Text>
                                                        </Group>
                                                    </List.Item>
                                                ))}
                                            </List>
                                        ) : (
                                            <Text c="dimmed" size="sm" fs="italic">No keywords found in this
                                                file.</Text>
                                        )}
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </ScrollArea>
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
                                        value={composeStatus ? composeStatus.totalFilesCount / composeStatus.processedFilesCount * 100 : 0}
                                        labelPosition="center"
                                        label={`${composeStatus?.processedFilesCount || 0} / ${composeStatus?.totalFilesCount || 0} composed`}>
                                    </SemiCircleProgress>
                                    <RingProgress
                                        size={150}
                                        thickness={20}
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