import {useFileDialog} from "@mantine/hooks";
import {ActionIcon, Button, Flex, ScrollArea} from "@mantine/core";
import { IconX} from "@tabler/icons-react";
import {useFileContext} from "@/app/provider/FileProvder";


export function UploadFilesBox() {

    const {files, addFiles, removeFile: removeFile } = useFileContext();

    const fileDialog = useFileDialog({
        accept: ".pdf",
        directory: true,
        onChange: (payload) => payload && addFiles(Array.from(payload))
    });

    const pickedFiles = files.map((file) => (
        <Flex key={file.name} bdrs="10"  bd="1px solid" justify="space-between" align="center" p="6" m="4">
            <span>{file.name}</span>
            <Flex>
                <ActionIcon variant="filled" color="red" radius="xl" aria-label="Delete file" onClick={() => removeFile(file)}>
                    <IconX/>
                </ActionIcon>
            </Flex>
        </Flex>
    ));

    return (
            <div className="flex flex-col gap-2 w-full h-full mt-4 overflow-hidden">
                <div className="max-w-1/3 lg:w-1/3 mx-auto flex-shrink-0">
                    <Button
                        onClick={fileDialog.open}
                        size="xl"
                        fullWidth
                    >Upload Files</Button>
                </div>
                {pickedFiles.length > 0 && (
                    <ScrollArea className="flex-1 min-h-0 mx-auto xl:w-4xl lg:w-2xl">
                        <Flex direction="column" pb="md" >{pickedFiles}</Flex>
                    </ScrollArea>
                )}
            </div>
    )
}