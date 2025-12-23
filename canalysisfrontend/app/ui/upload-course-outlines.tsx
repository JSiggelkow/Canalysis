"use client";

import React, {useRef} from "react"; // useState entfernt, da wir Props nutzen
import {Button, Card, Chip, ScrollShadow, Separator, Select, ListBox} from "@heroui/react";
import {IconFile, IconX} from "@tabler/icons-react";
import {FileWithPrompt} from "@/app/page";
import {useAnalysis} from "@/app/context/AnalysisContext";

// Props Definition hinzufügen
interface UploadProps {
    files: FileWithPrompt[];
    setFiles: React.Dispatch<React.SetStateAction<FileWithPrompt[]>>;
}

export default function UploadCourseOutlines({files, setFiles}: UploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);
    const {prompts, selectedPromptId} = useAnalysis();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                promptId: selectedPromptId
            }));
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const updateFilePrompt = (index: number, promptId: string) => {
        setFiles((prev) => prev.map((f, i) => i === index ? {...f, promptId} : f));
    };

    const setAllPrompts = (promptId: string) => {
        setFiles((prev) => prev.map(file => ({...file, promptId})));
    };

    return (
        <Card className="w-full h-full gap-4 p-4">
            <Card.Header className="flex justify-between items-center">
                <h2 className="text-xl font-bold">File & Folder Upload</h2>

            </Card.Header>
            <Card.Content className="flex flex-col flex-grow overflow-hidden min-h-0">
                <div className="flex gap-2 flex-shrink-0">
                    <input
                        type="file"
                        multiple
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <Button
                        variant="secondary"
                        onPress={() => fileInputRef.current?.click()}
                    >
                        Choose Files
                    </Button>

                    <input
                        type="file"
                        webkitdirectory=""
                        directory=""
                        multiple
                        hidden
                        ref={folderInputRef}
                        onChange={handleFileChange}
                    />
                    <Button
                        variant="secondary"
                        onPress={() => folderInputRef.current?.click()}
                    >
                        Choose Folder
                    </Button>
                    {files.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Select
                                fullWidth={true}
                                placeholder="Select prompt for all files"
                                aria-label="Select prompt for all files"
                                className="w-32"
                                onChange={(val) => {
                                    if (val) setAllPrompts(val as string);
                                }}
                            >
                                <Select.Trigger>
                                    <Select.Value/>
                                    <Select.Indicator/>
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {prompts.map((p) => (
                                            <ListBox.Item key={p.id} id={p.id} textValue={p.name}>
                                                {p.name}
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>
                    )}
                </div>

                <Separator className="my-4 flex-shrink-0"/>

                <ScrollShadow className="flex-grow min-h-0 pr-2">
                    {files.length === 0 ? (
                        <p className="text-default-400 text-center py-10">No files selected</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {files.map((item, index) => (
                                <div key={index}
                                     className="flex items-center justify-between p-2 bg-default-100 rounded-lg">
                                    <div className="flex items-center gap-2 overflow-hidden flex-grow">
                                        <IconFile size={16} className="text-default-500 flex-shrink-0"/>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-tiny truncate">
                                                {item.file.name}
                                            </span>
                                            <span className="text-[10px] text-default-400">
                                                ({(item.file.size / 1024).toFixed(1)} KB)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-2">
                                        <Select
                                            placeholder="Select prompt"
                                            aria-label="Select prompt"
                                            className="w-28"
                                            value={item.promptId}
                                            onChange={(val) => {
                                                if (val) updateFilePrompt(index, val as string);
                                            }}
                                        >
                                            <Select.Trigger>
                                                <Select.Value/>
                                                <Select.Indicator/>
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    {prompts.map((p) => (
                                                        <ListBox.Item key={p.id} id={p.id} textValue={p.name}>
                                                            {p.name}
                                                        </ListBox.Item>
                                                    ))}
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>

                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="danger"
                                            onPress={() => removeFile(index)}
                                        >
                                            <IconX size={14}/>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollShadow>

                <Separator className="my-4 flex-shrink-0"/>

                <div className="flex justify-between items-center flex-shrink-0">
                    <Chip variant="primary" color="accent">
                        {files.length} files selected
                    </Chip>
                </div>
            </Card.Content>
        </Card>
    );
}
