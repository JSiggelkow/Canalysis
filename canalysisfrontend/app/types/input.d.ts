import React from "react";
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

export type AnalysisStatus = 'idle' | 'running' | 'keywords_found' | 'no_keywords_found_ai_search' | 'completed' | 'no_content_found' | 'error';

export interface KeywordMatch {
    keyword: string;
    page: number;
}

export interface FileAnalysisResult {
    fileName: string;
    status: AnalysisStatus;
    keywords: KeywordMatch[];
    aiResult?: string;
    error?: string;
}