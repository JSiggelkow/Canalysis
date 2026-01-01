'use client'

import {Accordion, Badge, Button, Flex, Group, Modal, NativeSelect, Text, Textarea, TextInput} from "@mantine/core";
import {useEffect, useMemo, useState} from "react";
import {Prompt} from "@/app/entity/Prompt";
import api from "../lib/api";
import {notifications} from "@mantine/notifications";
import {IconMoodSad2, IconPlus, IconSparkles, IconTrash} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {usePromptContext} from "@/app/provider/PromptProvider";


export function EditPrompts() {

    const {prompts, addPrompt, removePrompt, activePrompt, setActivePrompt} = usePromptContext();

    const [searchValue, setSearchValue] = useState('');
    const [newPromptName, setNewPromptName] = useState('');
    const [newPromptLanguage, setNewPromptLanguage] = useState('en');
    const [newPromptValue, setNewPromptValue] = useState('');
    const [opened, {open, close}] = useDisclosure(false);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await
                    api.get<Prompt[]>('/prompts')
                response.data.forEach(p => addPrompt(p));
            } catch (e) {
                notifications.show({
                    title: 'error',
                    message: 'failed to fetch prompts',
                    color: 'red'
                })
            }
        }

        fetchPrompts().then();
    }, [])

    const addNewPrompt = async () => {
        try {
            const response = await api.post<Prompt>('/prompts', {
                name: newPromptName,
                language: newPromptLanguage,
                prompt: newPromptValue
            })
            setNewPromptName('');
            setNewPromptLanguage('en');
            setNewPromptValue('');
            addPrompt(response.data);
            close();
            notifications.show({
                title: 'success',
                message: 'added new prompt successfully',
                color: 'teal'
            })
        } catch (e) {
            notifications.show({
                title: 'error',
                message: 'prompt could not be added',
                color: 'red'
            })
        }
    }

    const deletePrompt = async (prompt: Prompt) => {
        try{
            await api.delete(`/prompts/${prompt.id}`)
            removePrompt(prompt);
            notifications.show({
                title: 'success',
                message: 'deleted prompt successfully',
                color: 'teal'
            })
        } catch (e) {
            notifications.show({
                title: 'error',
                message: 'could not delete prompt',
                color: 'red'
            })
        }
    }

    const filteredPrompts = useMemo(() => {
            return prompts.filter(p => p.name.toLowerCase().startsWith(searchValue.toLowerCase()));
        }, [prompts, searchValue]);

    const promptItems = filteredPrompts.map(prompt => {
        const isActive = activePrompt?.id === prompt.id;
        return (
            <Accordion.Item key={prompt.id} value={prompt.name}>
                <Accordion.Control>
                    <Group justify="space-between" align="center" gap="xs">
                        <Group align="center" gap="xs">
                            <IconSparkles size={18} className="text-gray-500"/>
                            <Text w={300} truncate="end">{prompt.name}</Text>
                        </Group>
                        <Group align="center" gap="xs" mr="xs">
                            <Button
                                size="xs"
                                component="div"
                                variant={isActive ? "filled" : "outline"}
                                color={isActive ? "green" : "gray"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isActive) {
                                            setActivePrompt(null);
                                        } else {
                                            setActivePrompt(prompt);
                                        }
                                }}
                            >{isActive ? "active" : "select"}</Button>
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
                                    deletePrompt(prompt).then();
                                }}
                            >delete</Button> <Badge variant="light">{prompt.language}</Badge>
                        </Group>
                    </Group>
                </Accordion.Control>
                <Accordion.Panel>{prompt.prompt}</Accordion.Panel>
            </Accordion.Item>
        )
    })


    return (
        <Flex direction="column" className="flex-1  xl:w-4xl lg:w-2xl h-full mx-auto">
            <Flex justify="space-between" align="center" gap="sm" className="mb-2">
                <TextInput
                    placeholder="search prompts"
                    variant="filled"
                    size="md"
                    radius="xl"
                    onChange={(e) => setSearchValue(e.currentTarget.value)}
                />
                <Modal opened={opened} onClose={close} size="xl" title="Add new prompt">
                    <Flex direction="column" gap="md">
                        <TextInput
                            label="name"
                            placeholder="e.g. analysis of a pdf file"
                            variant="filled"
                            size="md"
                            radius="xl"
                            value={newPromptName}
                            onChange={(e) => setNewPromptName(e.currentTarget.value)}
                        />
                        <NativeSelect label="language" size="md" variant="filled" radius="xl" data={['de', 'en']}
                                      value={newPromptLanguage}
                                      onChange={(e) => setNewPromptLanguage(e.currentTarget.value)}/>
                        <Textarea
                            label="prompt"
                            placeholder="e.g. analyze the following pdf file for keywords and their occurrences in the pages."
                            variant="filled"
                            size="md"
                            autosize
                            minRows={8}
                            maxRows={16}
                            value={newPromptValue}
                            onChange={(e) => setNewPromptValue(e.currentTarget.value)}
                        />
                        <Button onClick={addNewPrompt} variant="filled" size="sm" color="blue"
                                leftSection={<IconPlus size={18}/>}>add new prompt</Button>
                    </Flex>
                </Modal>
                <Button onClick={open} variant="filled" size="sm" color="blue" leftSection={<IconPlus size={18}/>}>new
                    prompt</Button>
            </Flex>
            <Accordion variant="separated" radius="md" className="pb-8">
                {prompts.length === 0 ? <Group align="center" justify="center" mt="xl" >
                    <IconMoodSad2 size={18} className="text-gray-500" />
                    <Text>no prompts added yet</Text>
                </Group> : promptItems}
            </Accordion>
        </Flex>
    )

}