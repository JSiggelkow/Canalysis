import {useFileDialog} from "@mantine/hooks";
import {ActionIcon, Button, Card, Flex, Group, ScrollArea, Text, Tooltip} from "@mantine/core";
import {IconFileText, IconX} from "@tabler/icons-react";
import {useFileContext} from "@/app/provider/FileProvder";


export function UploadFilesBox() {

    const {files, addFiles, removeFile: removeFile, clearFiles} = useFileContext();

    const fileDialog = useFileDialog({
        accept: ".pdf",
        directory: true,
        multiple: true,
        onChange: (payload) => payload && addFiles(Array.from(payload))
    });

    const pickedFiles = files.map((file) => (
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
    ));

    return (
        <div className="flex flex-col gap-2 w-full h-full mt-4 overflow-hidden">
            <div className="max-w-2/3 w-2/3 mx-auto flex-shrink-0 flex flex-row items-center justify-center gap-4">
                <Button
                    onClick={fileDialog.open}
                    size="xl"
                    w={300}
                >Upload Files</Button>
                    <Button
                        variant="filled"
                        color="red"
                        radius="sm"
                        disabled={pickedFiles.length === 0}
                        onClick={clearFiles}
                        rightSection={<IconX size={25}/>}>
                        delete all
                    </Button>
            </div>
            {pickedFiles.length > 0 && (
                <ScrollArea className="flex-1 min-h-0 mx-auto xl:w-4xl lg:w-2xl">
                    <Flex direction="column" pb="md" pr="md">{pickedFiles}</Flex>
                </ScrollArea>
            )}
        </div>
    )
}