export interface ComposeStatus {
    currentFileName: string;
    processedFilesCount: number;
    totalFilesCount: number;
    totalPagesAdded: number;
    totalPagesCount: number;
    status: 'initializing' | 'processing' | 'saving' | 'completed';
}
