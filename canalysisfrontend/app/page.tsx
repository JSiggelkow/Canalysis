'use client'
import {Button, Group, Stepper} from "@mantine/core";
import {useState} from "react";
import {UploadFilesBox} from "@/app/ui/UploadFilesBox";
import {useFileContext} from "@/app/provider/FileProvider";
import {CheckKeywords} from "@/app/ui/CheckKeywords";
import {useResultContext} from "@/app/provider/ResultProvider";
import {ComposeFiles} from "@/app/ui/ComposeFiles";
import {useComposedFileContext} from "@/app/provider/ComposedFileProvider";
import {AnalyzeComposedFile} from "@/app/ui/AnalyzeComposedFile";

export default function Home() {

    const {files} = useFileContext();
    const {results} = useResultContext();
    const {composedFile, composeStatus} = useComposedFileContext();

    const isStep1Valid = files.length > 0;
    const isStep2Valid = results.length > 0;
    const isStep3Valid = composedFile !== undefined && composedFile !== null
        && composeStatus !== undefined && composeStatus !== null
        && composeStatus?.status === "completed";

    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


    return (
        <>
            <div className="w-full max-w-12xl h-screen p-4">
                <div className="flex flex-col w-7xl mx-auto h-full">
                    <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}
                             className="flex-1 flex flex-col overflow-hidden" classNames={{
                        content: "flex-1 flex flex-col overflow-hidden pt-4",
                        root: "flex flex-col h-full"
                    }}>
                        <Stepper.Step label="step 1" description="upload files" allowStepSelect={true}>
                            <UploadFilesBox/>
                        </Stepper.Step>
                        <Stepper.Step label="step 2" description="check for keywords" allowStepSelect={isStep1Valid}>
                            <CheckKeywords/>
                        </Stepper.Step>
                        <Stepper.Step label="step 3" description="compose files"
                                      allowStepSelect={isStep1Valid && isStep2Valid}>
                            <ComposeFiles/>
                        </Stepper.Step>
                        <Stepper.Step label="step 4" description="analyze composed file" allowStepSelect={isStep1Valid && isStep2Valid && isStep3Valid}>
                            <AnalyzeComposedFile />
                        </Stepper.Step>
                        <Stepper.Completed>
                            Completed, click back button to get to step 1
                        </Stepper.Completed>
                    </Stepper>
                    <Group justify="center" mt="auto" h="50">
                        <Button variant="default" onClick={prevStep}>back</Button>
                        <Button onClick={nextStep}
                                disabled={((active === 0 && !isStep1Valid) || (active === 1 && !isStep2Valid) || (active === 2 && !isStep3Valid))}>
                            next step
                        </Button>
                    </Group>
                </div>
            </div>
        </>
    );

}
