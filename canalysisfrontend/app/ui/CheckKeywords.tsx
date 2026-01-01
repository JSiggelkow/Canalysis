'use client'

import {
    Accordion,
    Badge,
    Button,
    Card, Flex,
    Group,
    List,
    rem, RingProgress,
    ScrollArea,
    SemiCircleProgress,
    Tabs,
    Text,
    ThemeIcon
} from "@mantine/core";
import {useMemo, useState} from "react";
import {notifications} from "@mantine/notifications";
import {useKeywordContext} from "@/app/provider/KeywordProvider";
import {useFileContext} from "@/app/provider/FileProvider";
import {searchFileForKeywords} from "@/app/lib/PdfSearchService";
import {IconCheck, IconFileText, IconX} from "@tabler/icons-react";
import {useResultContext} from "@/app/provider/ResultProvider";
import {FilesList} from "@/app/ui/FilesList";
import {EditKeywords} from "@/app/ui/EditKeywords";

export function CheckKeywords() {

    const {files, removeFile} = useFileContext();
    const {keywords} = useKeywordContext();
    const {results, addResult, clearResults} = useResultContext();

    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisStatus, setAnalysisStatus] = useState<string>(results.length > 0 ? "finished" : "off")
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState<string | null>(results.length > 0 ? "results" : "keywords");

    const onCheckKeywords = async () => {
        setActiveTab("results");
        setIsAnalyzing(true);
        setAnalysisStatus("running");
        clearResults();

        const BATCH_SIZE = 3;
        for (let i = 0; i < files.length; i += BATCH_SIZE) {
            const batch = files.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(async (file) => {
                const result = await searchFileForKeywords(file, keywords);
                setCurrentFile(file);
                addResult(result);
            }));
        }

        setIsAnalyzing(false);
        setAnalysisStatus("finished");
        setCurrentFile(null);

        notifications.show({
            title: 'Analysis completed',
            message: `Checked ${files.length} files.`,
            color: 'green'
        })
    }

    const uniqueKeywordsFound = useMemo(() => {
        return results.reduce((acc, result) => {
            result.matches.forEach(match => acc.add(match.keyword.toLowerCase()));
            return acc;
        }, new Set<string>()).size;
    }, [results]);

    const totalMatchesCount = useMemo(() => {
        return results.reduce((acc, result) => acc + result.matches.length, 0);
    }, [results]);

    const filesWithMatchesCount = useMemo(() => {
        return results.filter(r => r.matches.length > 0).length;
    }, [results]);

    return (
        <div className="flex flex-col gap-2 w-full h-full mt-4 overflow-hidden">
            <div className="max-w-1/3 lg:w-1/3 mx-auto flex-shrink-0">
                <Button
                    disabled={keywords.length === 0 || isAnalyzing}
                    loading={isAnalyzing}
                    size="xl"
                    fullWidth
                    onClick={onCheckKeywords}
                >check for keywords</Button>
            </div>

            <Tabs value={activeTab} onChange={setActiveTab} className="flex-1 flex flex-col min-h-0 h-full"
                  variant="outline" radius="md">
                <Tabs.List justify="center">
                    <Tabs.Tab value="files">files</Tabs.Tab>
                    <Tabs.Tab value="keywords">keywords</Tabs.Tab>
                    <Tabs.Tab value="results" disabled={analysisStatus === 'off'}>results</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="files" className="flex-1 flex flex-col h-full min-h-0 p-4">
                    <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl p-2">
                        <FilesList files={files} removeFile={removeFile}/>
                    </ScrollArea>
                </Tabs.Panel>

                <Tabs.Panel value="keywords" className="flex-1 flex flex-col h-full min-h-0 p-4">
                    <EditKeywords/>
                </Tabs.Panel>

                <Tabs.Panel value="results" className="flex-1 flex h-full flex-col min-h-0 p-2">
                    <div className="flex-shrink-0 min-h-0 w-full xl:w-4xl lg:w-2xl mx-auto m-2">
                        <Card shadow="sm" radius="md" p="xl">
                            <Card.Section>
                                <Group justify="space-between" mb="xs">
                                    <Flex direction="row">
                                        <IconFileText size={24} className="text-gray-500"/>
                                        <Text w={600}
                                              truncate="end">
                                            {analysisStatus === "finished" ? "click check for keywords to start another analysis"
                                                : analysisStatus === "off" ? "click check for keywords to start analysis"
                                                    : analysisStatus === "running" && currentFile ? currentFile.name : ""}</Text>
                                    </Flex>
                                    <Badge
                                        color={analysisStatus === "off" ? 'gray' : analysisStatus === "running" ? 'blue' : 'green'}
                                    >{analysisStatus}</Badge>
                                </Group>
                                <Group justify="space-evenly">
                                    <SemiCircleProgress
                                        fillDirection="left-to-right"
                                        orientation="up"
                                        filledSegmentColor="blue"
                                        size={200}
                                        thickness={12}
                                        value={files.length > 0 ? results.filter(result => result.status === 'completed').length / files.length * 100 : 0}
                                        labelPosition="center"
                                        label={`${results.filter(result => result.status === 'completed').length} / ${files.length}`}>
                                    </SemiCircleProgress>
                                    <RingProgress
                                        size={120}
                                        thickness={12}
                                        label={
                                            <Flex direction="row" align="center">
                                                <IconFileText size={20} className="text-gray-500 mx-auto"/>
                                            </Flex>
                                        }
                                        sections={[
                                            {
                                                value: filesWithMatchesCount / files.length * 100,
                                                color: 'blue',
                                                tooltip: `${filesWithMatchesCount} files have keywords`
                                            },
                                            {
                                                value: (files.length - filesWithMatchesCount) / files.length * 100,
                                                color: 'gray',
                                                tooltip: `${files.length - filesWithMatchesCount} files do not have keywords`
                                            }
                                        ]}
                                    />
                                    <RingProgress
                                        size={120}
                                        thickness={12}
                                        label={
                                            <Flex direction="row" align="center">
                                                <IconCheck size={20} className="text-gray-500 mx-auto"/>
                                            </Flex>
                                        }
                                        sections={[
                                            {
                                                value: uniqueKeywordsFound / keywords.length * 100,
                                                color: 'blue',
                                                tooltip: `${uniqueKeywordsFound} different keywords found`
                                            },
                                            {
                                                value: (keywords.length - uniqueKeywordsFound) / keywords.length * 100,
                                                color: 'gray',
                                                tooltip: `${totalMatchesCount - uniqueKeywordsFound} keywords not found`
                                            }
                                        ]}

                                    />
                                    <Text w={200} size="xl" c="blue">{totalMatchesCount} matches found</Text>

                                </Group>
                            </Card.Section>
                        </Card>
                    </div>

                    <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl p-2">
                        <Accordion variant="separated" radius="md" className="pb-8">
                            {results.map((result) => (
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
                                            <Text c="dimmed" size="sm" fs="italic">no keywords found in this
                                                file.</Text>
                                        )}
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </ScrollArea>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}