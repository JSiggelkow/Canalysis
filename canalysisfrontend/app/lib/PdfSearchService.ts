import {Keyword} from "../entity/Keyword";
import {TextItem} from "pdfjs-dist/types/src/display/api";

export interface KeywordMatch {
    keyword: string;
    pages: number[];
}

export interface KeywordSearchResult {
    fileName: string;
    file: File;
    status: 'penging' | 'processing' | 'completed' | 'failed';
    matches: KeywordMatch[];
    error?: string;
}

export const searchFileForKeywords = async (file: File, keywords: Keyword[]): Promise<KeywordSearchResult> => {
    try {

        const pdfjsLib = await import('pdfjs-dist');

        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
                'pdfjs-dist/build/pdf.worker.min.mjs',
                import.meta.url,
            ).toString();
        }

        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(buffer).promise;
        const foundMatches: Map<string, Set<number>> = new Map();

        keywords.forEach(keyword => foundMatches.set(keyword.keyword.toLowerCase(), new Set()));

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageText = textContent.items
                .map((item) => (item as TextItem).str)
                .join(' ')
                .toLowerCase();

            keywords.forEach(keyword => {
                const lowerKeyword = keyword.keyword.toLowerCase();
                const escapedKeyword = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                const regex = new RegExp(`(^|[^a-z0-9äöüß])${escapedKeyword}([^a-z0-9äöüß]|$)`);

                if (regex.test(pageText)) {
                    foundMatches.get(lowerKeyword)?.add(i);
                }
            });
        }

            const matches: KeywordMatch[] = [];
            foundMatches.forEach((pages, keyword) => pages.size > 0 && matches.push({
                keyword,
                pages: Array.from(pages)
            }));

            return {
                file: file,
                fileName: file.name,
                status: 'completed',
                matches
            }
    } catch (e: any) {
        return {
            file: file,
            fileName: file.name,
            status: 'failed',
            error: e.message,
            matches: []
        }
    }
}