'use client'

import {useResultContext} from "@/app/provider/ResultProvider";
import {
    Accordion,
    Badge,
    Button,
    Chip,
    Flex,
    Group,
    List,
    rem,
    ScrollArea,
    Text,
    TextInput,
    ThemeIcon
} from "@mantine/core";
import {IconCheck, IconFileText, IconTrash, IconX} from "@tabler/icons-react";
import {useMemo, useState} from "react";

interface KeywordSearchResultProps{
    preSetOnlyMatches?: boolean | undefined,
}

export function KeywordSearchResultList({preSetOnlyMatches}: KeywordSearchResultProps = {preSetOnlyMatches: false}) {

    const {results, clearResults, removeResult} = useResultContext();

    const [onlyMatches, setOnlyMatches] = useState<boolean>(preSetOnlyMatches ? preSetOnlyMatches : false);
    const [sorted, setSorted] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');

    const updateSearchValue = (value: string) => {
        setSearchValue(value);
    }

    const filteredResults = useMemo(() => {
        let processedResults = [...results];

        if (onlyMatches) {
            processedResults = processedResults.filter(r => r.matches.length > 0);
        }

        if (searchValue.trim()) {
            processedResults = processedResults.filter(r =>
                r.matches.some(m => m.keyword.toLowerCase().includes(searchValue.toLowerCase()))
            );
        }

        if (sorted) {
            processedResults.sort((a, b) => a.fileName.localeCompare(b.fileName));
        }

        return processedResults;
    }, [results, onlyMatches, sorted, searchValue]);

    return (
        <Flex direction="column" gap="2" className="h-full mx-auto">
            <Group justify="space-between" className="mb-2">
                <TextInput
                    variant="filled"
                    size="md"
                    w={400}
                    placeholder="filter by keyword"
                    value={searchValue}
                    onChange={(e) => updateSearchValue(e.currentTarget.value)}
                />
                <Flex direction="row" gap="xs">
                    <Chip checked={onlyMatches} onChange={() => setOnlyMatches(!onlyMatches)}>show only matches</Chip>
                    <Chip checked={sorted} onChange={() => setSorted(!sorted)}>sort by name</Chip>
                </Flex>
            </Group>
            <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl p-2">
                <Accordion variant="separated" radius="md" className="pb-8">
                    {filteredResults.map((result) => (
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
                                    <Group gap="xs">
                                        <Button
                                            variant="outline"
                                            size="xs"
                                            color="red"
                                            component="div"
                                            leftSection={
                                                <IconTrash size={18} color="red"/>
                                            }
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeResult(result)
                                            }}
                                        >delete</Button>
                                        <Badge w={100} color={result.matches.length > 0 ? "teal" : "gray"}
                                               variant="light">{result.matches.length} Matches</Badge>
                                    </Group>
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
        </Flex>
    )
}