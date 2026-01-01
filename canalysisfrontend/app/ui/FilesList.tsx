import {ActionIcon, Card, Flex, Group, Text} from "@mantine/core";
import {IconFileText, IconX} from "@tabler/icons-react";

interface FilesListProps {
    files: File[];
    removeFile: (file: File) => void;
}

export function FilesList({files, removeFile}: FilesListProps & {}) {
    return (
        <Flex direction="column">
            {files.map((file) => (
                <Card key={file.name} shadow="xs" withBorder radius="xl" m="2" p="2">
                    <Group justify="space-between" align="center" p="6" m="4">
                        <div className="flex flex-row gap-2">
                            <IconFileText size={24}/>
                            <Text w={700} truncate="end">{file.name}</Text>
                        </div>
                        <Flex>
                            <ActionIcon variant="filled" color="red" radius="xl" aria-label="Delete file"
                                        onClick={() => removeFile(file)}>
                                <IconX/>
                            </ActionIcon>
                        </Flex>
                    </Group>
                </Card>
            ))}
        </Flex>
    )
}