import {
    Alert,
    Badge,
    Card,
    Center,
    Flex,
    Group,
    Loader,
    NativeSelect,
    ScrollArea,
    Slider,
    Text,
    Tooltip
} from "@mantine/core";
import {
    IconCheck,
    IconFileText,
    IconFileUpload, IconFlame, IconFlameFilled, IconInfoCircle,
    IconRobotFace, IconSnowflake,
    IconSparkles, IconTemperatureSnow,
    IconTrash,
    IconX
} from "@tabler/icons-react";
import {useComposedFileContext} from "@/app/provider/ComposedFileProvider";
import MarkdownPreview from '@uiw/react-markdown-preview';
import {useAnalysisContext} from "@/app/provider/AnalysisProvider";
import {usePromptContext} from "@/app/provider/PromptProvider";

export function Analysis() {

    const {composedFile} = useComposedFileContext();
    const {analysisText, analysisStatus, temperature, setTemperature, model, setModel} = useAnalysisContext();
    const {activePrompt, prompts, setActivePrompt} = usePromptContext()

    const badgeIcon = {
        uploading: <IconFileUpload size={20}/>,
        analyzing: <IconSparkles size={20}/>,
        responding: <IconRobotFace size={20}/>,
        cleaning: <IconTrash size={20}/>,
        completed: <IconCheck size={20}/>,
        failed: <IconX size={20}/>,
    }

    const renderContent = () => {
        switch (analysisStatus) {
            case "uploading":
            case "analyzing":
                return (
                    <Center m="xl" h="100%">
                        <Loader type="bars"/>
                    </Center>
                );
            case "responding":
            case "cleaning up":
            case "completed":
                return <MarkdownPreview className="bg-transparent w-full mt-4" source={analysisText}/>;
            case "failed":
                return <Center m="xl" h="100%">
                    <Alert color="red" title="Analysis failed" icon={<IconInfoCircle size={20}/>} radius="md">
                        <Text>analysis failed, please try again later.</Text>
                    </Alert>
                </Center>;
            default:
                return <Center m="xl" h="100%">
                    <Alert variant="light" color="blue" title="analyse the composed file"
                           icon={<IconInfoCircle size={20}/>} radius="md">
                        set prompt, model and temperature and start analyzing the composed file
                    </Alert>
                </Center>;
        }
    }

    return (
        <Flex direction="column" className="flex-1 min-h-0 h-full mx-auto xl:w-4xl lg:w-2xl mb=2">
            <Card shadow="xs" withBorder radius="xl" m="2" p="2">
                <Group justify="space-between" align="center" p="6" m="4">
                    <Flex direction="row">
                        <IconFileText size={24} className="text-gray-500"/>
                        <Text w={500}
                              truncate="end">{composedFile ? composedFile.name : "no composed file provided"}</Text>
                    </Flex>
                    <Badge variant="gradient" gradient={
                        analysisStatus === "uploading" ? {from: 'blue', to: 'blue', deg: 45} :
                            analysisStatus === "analyzing" || analysisStatus === "responding" ? {
                                    from: 'blue',
                                    to: 'grape',
                                    deg: 45
                                } :
                                analysisStatus === "completed" ? {from: 'teal', to: 'teal', deg: 45} :
                                    analysisStatus === "failed" ? {from: 'red', to: 'red', deg: 45} :
                                        analysisStatus === "cleaning up" ? {from: 'orange', to: 'orange', deg: 45} :
                                            {from: 'gray', to: 'gray', deg: 45}
                    }
                           leftSection={
                               analysisStatus === "uploading" ? badgeIcon.uploading :
                                   analysisStatus === "analyzing" ? badgeIcon.analyzing :
                                       analysisStatus === "responding" ? badgeIcon.responding :
                                           analysisStatus === "completed" ? badgeIcon.completed :
                                               analysisStatus === "cleaning up" ? badgeIcon.cleaning :
                                                   analysisStatus === "failed" ? badgeIcon.failed : ""
                           }
                    >{analysisStatus}</Badge>
                </Group>
                <Group justify="space-evenly" className="mt-2">
                    <NativeSelect
                        w={170}
                        variant="filled"
                        label="select prompt"
                        value={activePrompt?.name}
                        data={prompts.map(p => ({value: p.name, label: p.name}))}
                        onChange={(e) => setActivePrompt(prompts.filter(p => p.name === e.currentTarget.value)[0] ?? prompts[0])}
                    />
                    <NativeSelect
                        w={170}
                        variant="filled"
                        label="select model"
                        value={model}
                        onChange={(e) => setModel(e.currentTarget.value as string)}
                        data={['gpt-5.2', 'gpt-5.2-pro']}
                    />
                    <Flex direction="column" align="center">
                        <Flex direction="row" align="center" gap="sm">
                            {
                                temperature > 0.7 && temperature < 1.2 ? <IconFlame size={24} color="orange"/> :
                                    temperature > 1.2 ? <IconFlameFilled size={24} color="red"/>
                                        : <IconSnowflake size={24} color="cyan"/>
                            }
                            <Tooltip multiline w={200}
                                     label="low temperatures make responses more focused and predictable, high temperatures encourage more diverse, imaginative, and sometimes less accurate results.">
                                <Text w={130}>temperature {temperature}</Text>
                            </Tooltip>
                        </Flex>
                        <Slider label={null} w={170} min={0} max={2} step={0.1} defaultValue={temperature}
                                onChange={setTemperature}/>
                    </Flex>
                </Group>
            </Card>
            <ScrollArea className="flex-1 min-h-0 flex justify-start">
                {renderContent()}
            </ScrollArea>
        </Flex>
    )
}