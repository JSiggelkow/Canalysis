import {useFileDialog} from "@mantine/hooks";
import {Button, ScrollArea} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {useFileContext} from "@/app/provider/FileProvider";
import {FilesList} from "@/app/ui/FilesList";


export function UploadFilesBox() {

    const {files, addFiles, removeFile: removeFile, clearFiles} = useFileContext();

    const fileDialog = useFileDialog({
        accept: ".pdf",
        directory: true,
        multiple: true,
        onChange: (payload) => payload && addFiles(Array.from(payload))
    });


    return (
        <div className="flex flex-col gap-2 w-full h-full mt-4 overflow-hidden">
            <div className="max-w-2/3 w-2/3 mx-auto flex-shrink-0 flex flex-row items-center justify-center gap-4">
                <Button
                    onClick={fileDialog.open}
                    size="xl"
                    w={300}
                >upload files</Button>
                    <Button
                        variant="filled"
                        color="red"
                        radius="sm"
                        disabled={files.length === 0}
                        onClick={clearFiles}
                        rightSection={<IconX size={25}/>}>
                        delete all
                    </Button>
            </div>
                <ScrollArea className="flex-1 min-h-0 mx-auto xl:w-4xl lg:w-2xl">
                    <FilesList files={files} removeFile={removeFile}/>
                </ScrollArea>
        </div>
    )
}