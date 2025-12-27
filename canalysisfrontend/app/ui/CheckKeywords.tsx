'use client'

import {Button, Pill, ScrollArea, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {Keyword} from "@/app/entity/Keyword";
import api from "@/app/lib/api";
import {notifications} from "@mantine/notifications";
import {useKeywordContext} from "@/app/provider/KeywordProvider";

export function CheckKeywords() {

    const {keywords, addKeywords, removeKeyword} = useKeywordContext();

    const [inputValue, setInputValue] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

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

    return (
        <div className="flex flex-col gap-2 w-full h-full mt-4 overflow-hidden">
            <div className="max-w-1/3 lg:w-1/3 mx-auto flex-shrink-0">
                <Button
                    disabled={keywords.length === 0}
                    size="xl"
                    fullWidth
                >Check for Keywords</Button>
            </div>
            <div className="flex-1 flex flex-col justify-between min-h-0">
                <ScrollArea className="flex-1 min-h-0 w-full mx-auto xl:w-4xl lg:w-2xl">
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
                    </div>
                </ScrollArea>

                <div className="w-1/2 mx-auto">
                    <TextInput
                        variant="filled"
                        size="lg"
                        radius="md"
                        placeholder="Add keywords"
                        value={inputValue}
                        error={error}
                        onChange={(event) => textInputChangeEvent(event.currentTarget.value)}
                        onKeyDown={(event) => (event.key === 'Enter') && !error && addKeyword(inputValue, "en")}/>
                    {<span className={`text-red-500 ${error ? '' : 'invisible'}`}>Keyword already exists</span>}
                </div>
            </div>
        </div>
    )
}