'use client'
import {Button, Flex, Group, Stepper} from "@mantine/core";
import {useState} from "react";
import {UploadFilesBox} from "@/app/ui/UploadFilesBox";
import {useFileContext} from "@/app/provider/FileProvder";
import {CheckKeywords} from "@/app/ui/CheckKeywords";

export default function Home() {

    const {files} = useFileContext();
    const isStep1Valid = files.length > 0;

    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));



    return (
        <>
            <div className="w-full max-w-12xl h-screen p-4">
                <div className="flex flex-col w-7xl mx-auto h-full">
                    <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} className="flex-1 flex flex-col overflow-hidden" classNames={{
                        content: "flex-1 flex flex-col overflow-hidden pt-4",
                        root: "flex flex-col h-full"
                    }}>
                        <Stepper.Step label="Step 1" description="Upload files" allowStepSelect={true}>
                            <UploadFilesBox />
                        </Stepper.Step>
                        <Stepper.Step label="Step 2" description="Check for keywords" allowStepSelect={isStep1Valid}>
                            <CheckKeywords />
                        </Stepper.Step>
                        <Stepper.Step label="Step 3" description="Compose files" allowStepSelect={false}>

                        </Stepper.Step>
                        <Stepper.Step label="Step 4" description="Analyze composed file" allowStepSelect={false}>

                        </Stepper.Step>
                        <Stepper.Completed>
                            Completed, click back button to get to step 1
                        </Stepper.Completed>
                    </Stepper>
                    <Group justify="center" mt="auto" h="50">
                        <Button variant="default" onClick={prevStep}>Back</Button>
                        <Button onClick={nextStep} disabled={active === 0 && !isStep1Valid}>Next step</Button>
                    </Group>
                </div>
            </div>
        </>
    );

}
