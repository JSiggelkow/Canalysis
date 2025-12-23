'use server'

import {openai} from "@ai-sdk/openai";
import { PDFParse } from "pdf-parse";
import {FileAnalysisResult, KeywordMatch} from "@/app/types/input";
import {generateText} from "ai";

export async function analyzeFileAction(formData: FormData): Promise<FileAnalysisResult> {
    const file = formData.get("file") as File;
    const filePath = formData.get("filePath") as string | null;
    const keywordsJson = formData.get("keywords") as string | null;
    const customPrompt = formData.get("prompt") as string | null;
    const promptLanguage = formData.get("promptLanguage") as string | null;

    if (!file) {
        throw new Error("No file submitted");
    }

    const keywords: string[] = keywordsJson ? JSON.parse(keywordsJson) : [];
    const keywordListStr = keywords.join(", ");

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        // 1. Keyword Check
        const parser = new PDFParse({ data: buffer });
        const pdfResult = await parser.getText();

        const foundKeywords: KeywordMatch[] = [];

        pdfResult.pages.forEach((page) => {
            const pageContent = page.text;
            const pageNum = page.num;
            keywords.forEach(keyword => {
                if (pageContent.toLowerCase().includes(keyword.toLowerCase())) {
                    // Verhindere Duplikate pro Seite
                    if (!foundKeywords.find(k => k.keyword === keyword && k.page === pageNum)) {
                        foundKeywords.push({keyword, page: pageNum});
                    }
                }
            });
        });

        await parser.destroy();

        if (foundKeywords.length > 0) {
            return {
                fileName,
                status: 'keywords_found',
                keywords: foundKeywords
            };
        }

        // 2. AI Deep Search if no keywords found
        let selectedPrompt = customPrompt || "";
        let notFoundString = "Nicht gefunden.";

        // Replace keywords placeholder if present
        selectedPrompt = selectedPrompt.replace("{{keywords}}", keywordListStr);

        // Logic for determining language specific "not found" string
        if (promptLanguage === 'en') {
            notFoundString = "Not found.";
        } else if (promptLanguage === 'de') {
            notFoundString = "Nicht gefunden.";
        } else {
            // Check if it's a default prompt with automatic language detection by path
            if (filePath) {
                const lowerPath = filePath.toLowerCase();
                if (lowerPath.includes('english')) {
                    notFoundString = "Not found.";
                } else {
                    notFoundString = "Nicht gefunden.";
                }
            }
        }

        // Robust check: if the user edited the prompt but kept the instruction about "Nicht gefunden." / "Not found."
        // we use the detected language to check for both just in case.
        const possibleNotFoundStrings = ["Nicht gefunden.", "Not found."];

        const aiResponse = await generateText({
            model: openai('gpt-5.2'),
            messages: [
                {
                    role: 'user',
                    content: [
                        {type: 'text', text: selectedPrompt},
                        {
                            type: 'file',
                            mediaType: file.type || 'application/pdf',
                            data: buffer,
                        }
                    ]
                }
            ]
        });

        const responseText = aiResponse.text.trim();
        const isNotFound = responseText === notFoundString || possibleNotFoundStrings.includes(responseText);

        return {
            fileName,
            status: isNotFound ? 'no_content_found' : 'completed',
            keywords: [],
            aiResult: aiResponse.text
        };

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error during analysis";
        console.error(`Error during analysis of ${fileName}:`, error);
        return {
            fileName,
            status: 'error',
            keywords: [],
            error: errorMessage
        };
    }
}