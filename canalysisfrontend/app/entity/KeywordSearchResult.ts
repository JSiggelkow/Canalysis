import {KeywordMatch} from "@/app/entity/KeywordMatch";

export interface KeywordSearchResult {
    fileName: string;
    file: File;
    pageCount: number;
    status: 'penging' | 'processing' | 'completed' | 'failed';
    matches: KeywordMatch[];
    error?: string;
}
