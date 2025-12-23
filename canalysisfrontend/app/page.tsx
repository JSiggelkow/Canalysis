'use client';

import { useState } from "react";
import { StartAnalysisButton, AnalysisHistory } from "@/app/ui/analysis-button";
import UploadCourseOutlines from "@/app/ui/upload-course-outlines";
import { Button } from "@heroui/react";
import Link from "next/link";

export interface FileWithPrompt {
    file: File;
    promptId: string;
}

export default function Home() {
  const [files, setFiles] = useState<FileWithPrompt[]>([]);

  return (
    <main className="w-screen h-screen flex items-center justify-center p-8 overflow-hidden bg-default-50">
      <div className="flex flex-row gap-8 items-start justify-center max-w-7xl w-full h-full max-h-[900px]">
          {/* Linke Seite: Upload & Start Button */}
          <div className="flex-1 flex flex-col gap-6 h-full min-h-0">
            <div className="flex-grow min-h-0">
              <UploadCourseOutlines files={files} setFiles={setFiles} />
            </div>
            <StartAnalysisButton files={files} setFiles={setFiles} />
          </div>
          
          {/* Rechte Seite: History & Navigation */}
          <div className="flex-1 flex flex-col gap-6 h-full min-h-0">
            <div className="flex-grow min-h-0">
              <AnalysisHistory />
            </div>
            
            <Link href="/settings">
              <Button 
                variant="secondary"
                className="w-full" 
              >
                Analysis Settings
              </Button>
            </Link>
          </div>
      </div>
    </main>
  );
}
