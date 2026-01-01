import {KeywordMatch} from "@/app/entity/KeywordMatch";

export interface KeywordSearchResult {
    fileName: string;
    file: File;
    pageCount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    matches: KeywordMatch[];
    error?: string;
}
