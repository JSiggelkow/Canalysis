"use client";

import React, { useRef } from "react"; // useState entfernt, da wir Props nutzen
import { Button, Card, Chip, ScrollShadow, Separator } from "@heroui/react";
import { IconFile, IconX } from "@tabler/icons-react";

// Props Definition hinzufügen
interface UploadProps {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function UploadCourseOutlines({ files, setFiles }: UploadProps) {
    // const [files, setFiles] = useState<File[]>([]); // ENTFERNT: Kommt jetzt von oben
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Wir nutzen setFiles aus den Props
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Card className="w-full h-full gap-4 p-4">
             {/* ... Der Rest des UI Codes bleibt exakt gleich ... */}
             <Card.Header>
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
                </div>

                <Separator className="my-4 flex-shrink-0"/>

                <ScrollShadow className="flex-grow min-h-0 pr-2">
                    {files.length === 0 ? (
                        <p className="text-default-400 text-center py-10">No files selected</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {files.map((file, index) => (
                                <div key={index}
                                     className="flex items-center justify-between p-2 bg-default-100 rounded-lg">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <IconFile size={16} className="text-default-500 flex-shrink-0"/>
                                        <span className="text-tiny truncate">
                                            {file.webkitRelativePath || file.name}
                                        </span>
                                        <span className="text-[10px] text-default-400">
                                            ({(file.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="danger"
                                        onPress={() => removeFile(index)}
                                    >
                                        <IconX size={14}/>
                                    </Button>
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
