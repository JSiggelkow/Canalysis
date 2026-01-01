import {Flex, Pill, ScrollArea, Text, TextInput} from "@mantine/core";
import {useEffect, useMemo, useState} from "react";
import {useKeywordContext} from "@/app/provider/KeywordProvider";
import {Keyword} from "@/app/entity/Keyword";
import api from "@/app/lib/api";
import {notifications} from "@mantine/notifications";


export function EditKeywords() {

    const {keywords, addKeywords, removeKeyword} = useKeywordContext();

    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(false);


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

    const onInputChange = (value: string) => {
        setError(false);
        setInputValue(value);
    }

    function keywordExist(keyword: string) {
        return keywords.some(k => k.keyword.toLowerCase() === keyword.toLowerCase());
    }

    async function addKeyword(keyword: string, language: string) {
        if (keyword.trim().length === 0) return;
        if (keywordExist(keyword)) {
            setError(true);
            notifications.show({
                title: 'error',
                message: `cannot add ${keyword}, keyword already exists`,
                color: 'red'
            })
            return;
        };
        try {
            const response = await api.post<Keyword>('/keywords', {keyword, language})
            addKeywords([response.data]);
            notifications.show({
                title: 'success',
                message: `${inputValue} added as keyword`,
                color: 'teal'
            })
            setInputValue('');
        } catch (e) {
            notifications.show({
                title: 'error',
                message: 'failed to add keyword',
                color: 'red'
            })
        }
    }

    async function deleteKeyword(keyword: Keyword) {
        try {
            await api.delete(`/keywords/${keyword.keyword}`)
            notifications.show({
                title: 'success',
                message: `${keyword.keyword} deleted successfully`,
                color: 'teal'
            })
            removeKeyword(keyword);
        } catch (e) {
            notifications.show({
                title: 'error',
                message: 'failed to remove keyword',
                color: 'red'
            })
        }
    }

    const filteredKeywords = useMemo(() => {
            return keywords.filter((k) => inputValue === '' || k.keyword.toLowerCase().startsWith(inputValue.toLowerCase()));
        }, [keywords, inputValue]);

    return (
        <Flex direction="column" className="h-full">
            <TextInput
                w={600}
                variant="filled"
                size="md"
                radius="xl"
                className="mx-auto"
                placeholder="search keywords press enter to add new keyword"
                value={inputValue}
                error={error}
                onChange={(e) => onInputChange(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'Enter' && addKeyword(inputValue, 'en')}
            />
            <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl p-2">
                <div className="flex flex-wrap gap-2">
                    {filteredKeywords.map((keyword: Keyword) => (
                        <Pill
                            size="sm"
                            key={keyword.keyword}
                            withRemoveButton
                            onRemove={() => deleteKeyword(keyword)}
                        >
                            {keyword.keyword}
                        </Pill>
                    ))}
                    {keywords.length === 0 &&
                        <Text c="dimmed" size="sm" ta="center" w="100%">No keywords added yet.</Text>}
                </div>
            </ScrollArea>
        </Flex>
    )
}
