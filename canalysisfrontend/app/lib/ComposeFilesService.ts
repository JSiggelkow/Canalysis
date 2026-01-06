import {KeywordSearchResult} from "@/app/entity/KeywordSearchResult";
import {PDFDocument, rgb} from "pdf-lib";
import {ComposeStatus} from "@/app/entity/ComposeStatus";

export const composeFilesService = async (
    results: KeywordSearchResult[],
    onProgress?: (status: ComposeStatus) => void
): Promise<File> => {

    const totalFilesCount = results.length;
    let processedFilesCount = 0;
    let totalPagesAdded = 0;

    const reportProgress = (fileName: string, status: ComposeStatus['status']) => {
        if (onProgress) {
            onProgress({
                currentFileName: fileName,
                processedFilesCount,
                totalFilesCount,
                totalPagesAdded,
                totalPagesCount: results.reduce((acc, r) => acc + r.pageCount, 0),
                status
            });
        }
    };

    reportProgress('', 'initializing');
    const mergedPdf = await PDFDocument.create();

    for (const result of results) {
        reportProgress(result.fileName, 'processing');

        const uniquePages = new Set<number>();
        result.matches.forEach(match => {
            match.pages.forEach(page => uniquePages.add(page));
        });

        if (uniquePages.size === 0) {
            processedFilesCount++;
            continue;
        }

        const arrayBuffer = await result.file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer);
        const sourcePageCount = sourcePdf.getPageCount();

        // Convert 1-based page numbers to 0-based indices and sort them
        const pageIndices = Array.from(uniquePages)
            .map(p => p - 1)
            .filter(idx => idx >= 0 && idx < sourcePageCount)
            .sort((a, b) => a - b);

        if (pageIndices.length > 0) {
            const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);
            copiedPages.forEach((page, index) => {
                mergedPdf.addPage(page)

                const originalPageNumber = pageIndices[index] + 1;
                result.matches.forEach(match => {
                    match.locations?.forEach(loc => {
                        if (loc.pageNumber === originalPageNumber) {
                            page.drawRectangle({
                                x: loc.x,
                                y: loc.y,
                                width: loc.width,
                                height: loc.height,
                                color: rgb(1, 1, 0),
                                opacity: 0.4,
                            })
                        }
                    })
                })
            });
            totalPagesAdded += copiedPages.length;
        }

        processedFilesCount++;
        reportProgress(result.fileName, 'processing');
    }

    reportProgress('', 'saving');
    const pdfBytes = await mergedPdf.save();

    reportProgress('', 'completed');
    const fileName = "canalysis-composed-" + new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-") + ".pdf";
    return new File([pdfBytes as BlobPart], fileName, {type: "application/pdf"});
}
