'use client'

import {
    Button,
    Card,
    Group,
    Pill,
    ScrollArea,
    SemiCircleProgress,
    TextInput,
    Text,
    Badge,
    Tabs, Accordion, ThemeIcon, rem, List
} from "@mantine/core";
import {useEffect, useState} from "react";
import {Keyword} from "@/app/entity/Keyword";
import api from "@/app/lib/api";
import {notifications} from "@mantine/notifications";
import {useKeywordContext} from "@/app/provider/KeywordProvider";
import {useFileContext} from "@/app/provider/FileProvder";
import {searchFileForKeywords} from "@/app/lib/PdfSearchService";
import {IconCheck, IconFileText, IconX} from "@tabler/icons-react";
import {useResultContext} from "@/app/provider/ResultProvider";

export function CheckKeywords() {

    const {keywords, addKeywords, removeKeyword} = useKeywordContext();
    const {files} = useFileContext();
    const {results, addResult, removeResult, clearResults} = useResultContext();

    const [inputValue, setInputValue] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisStatus, setAnalysisStatus] = useState<string>(results.length > 0 ? "finished" : "off")
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState<string | null>(results.length > 0 ? "results" : "keywords");

    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const response = await api.get<Keyword[]>('/keywords')
                addKeywords(response.data)
            } catch (e) {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to fetch keywords',
                    color: 'red'
                })
            }
        }

        fetchKeywords().then();
    }, []);

    function textInputChangeEvent(val: string) {
        setInputValue(val);
        setError(keywords.some(keyword => keyword.keyword === val.trim()));
    }

    async function addKeyword(keyword: string, language: string) {
        if (keyword.trim().length === 0) return;
        try {
            const response = await api.post<Keyword>('/keywords', {keyword, language})
            addKeywords([response.data]);
            setInputValue("");
        } catch (e) {
            notifications.show({
                title: 'Error',
                message: 'Failed to add keyword',
                color: 'red'
            })
        }
    }

    async function deleteKeyword(keyword: Keyword) {
        try {
            await api.delete(`/keywords/${keyword.keyword}`)
            removeKeyword(keyword);
        } catch (e) {
            notifications.show({
                title: 'Error',
                message: 'Failed to remove keyword',
                color: 'red'
            })
        }
    }

    const onCheckKeywords = async () => {
        setActiveTab("results");
        setIsAnalyzing(true);
        setAnalysisStatus("running");
        clearResults();

        const promises = files.map(async (file) => {
            const result = await searchFileForKeywords(file, keywords);
            setCurrentFile(file);
            addResult(result);
        });

        await Promise.all(promises);

        setIsAnalyzing(false);
        setAnalysisStatus("finished");
        setCurrentFile(null);

        notifications.show({
            title: 'Analysis completed',
            message: `Checked ${files.length} files.`,
            color: 'green'
        })
    }

    return (
        <div className="flex flex-col gap-2 w-full h-full mt-4 overflow-hidden">
            <div className="max-w-1/3 lg:w-1/3 mx-auto flex-shrink-0">
                <Button
                    disabled={keywords.length === 0 || isAnalyzing}
                    loading={isAnalyzing}
                    size="xl"
                    fullWidth
                    onClick={onCheckKeywords}
                >Check for Keywords</Button>
            </div>

            <Tabs value={activeTab} onChange={setActiveTab} className="flex-1 flex flex-col min-h-0 h-full" variant="outline" radius="md">
                <Tabs.List justify="center">
                    <Tabs.Tab value="keywords">Keywords</Tabs.Tab>
                    <Tabs.Tab value="results" disabled={analysisStatus === 'off'}>Results</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="keywords" className="flex-1 flex flex-col h-full min-h-0 pt-4">
                    <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl p-2">
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword) => (
                                <Pill
                                    size="sm"
                                    key={keyword.keyword}
                                    withRemoveButton
                                    onRemove={() => deleteKeyword(keyword)}
                                >
                                    {keyword.keyword}
                                </Pill>
                            ))}
                            {keywords.length === 0 && <Text c="dimmed" size="sm" ta="center" w="100%">No keywords added yet.</Text>}
                        </div>
                    </ScrollArea>

                    <div className="w-1/2 mx-auto m-2 flex-shrink-0">
                        <TextInput
                            variant="filled"
                            size="lg"
                            radius="md"
                            placeholder="Add keywords (Press Enter)"
                            value={inputValue}
                            error={error}
                            disabled={isAnalyzing}
                            onChange={(event) => textInputChangeEvent(event.currentTarget.value)}
                            onKeyDown={(event) => (event.key === 'Enter') && !error && addKeyword(inputValue, "en")}/>
                        {<span className={`text-red-500 ${error ? '' : 'invisible'}`}>Keyword already exists</span>}
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="results" className="flex-1 flex h-full flex-col min-h-0 p-2">
                    <div className="flex-shrink-0 min-h-0 w-full xl:w-4xl lg:w-2xl mx-auto m-2">
                        <Card shadow="sm" radius="md" p="xl">
                            <Card.Section>
                                <Group justify="flex-end" mb="xs">
                                    <Badge
                                        color={analysisStatus === "off" ? 'gray' : analysisStatus === "running" ? 'blue' : 'green'}
                                        size="sm">{analysisStatus}</Badge>
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
                                        label={`${results.filter(result => result.status === 'completed').length} / ${files.length} files`}>
                                    </SemiCircleProgress>
                                    <Text w={300} truncate="end">Analyzing: {currentFile?.name || "none"}</Text>
                                    <Text w={100}>Matches: {results.filter(result => result.matches.length != 0).length || 0}</Text>
                                </Group>
                            </Card.Section>
                        </Card>
                    </div>

                    <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl p-2">
                        <Accordion variant="separated" radius="md" className="pb-8">
                            {results.map((result) => (
                                <Accordion.Item key={result.fileName} value={result.fileName}>
                                    <Accordion.Control icon={
                                        <ThemeIcon color={result.matches.length > 0 ? 'teal' : 'gray'} variant="light" size="lg">
                                            {result.matches.length > 0 ? <IconCheck style={{width: rem(20), height: rem(20)}}/> : <IconX style={{width: rem(20), height: rem(20)}}/>}
                                        </ThemeIcon>
                                    }>
                                        <Group justify="space-between" wrap="nowrap">
                                            <Group gap="xs" wrap="nowrap">
                                                <IconFileText size={16} className="text-gray-500" />
                                                <Text truncate="end" w={300} fw={500}>{result.fileName}</Text>
                                            </Group>
                                            {result.matches.length > 0 && <Badge color="teal" variant="light">{result.matches.length} Matches</Badge>}
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
                                                            <Text size="xs" c="dimmed">found on pages: {match.pages.join(', ')}</Text>
                                                        </Group>
                                                    </List.Item>
                                                ))}
                                            </List>
                                        ) : (
                                            <Text c="dimmed" size="sm" fs="italic">No keywords found in this file.</Text>
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