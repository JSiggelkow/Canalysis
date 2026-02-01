// services/pdfService.ts
import { PDFDocument } from 'pdf-lib';
import { marked } from 'marked';

const PDF_STYLES = `
    body { font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #333; }
    h1 { font-size: 18px; color: #000; margin-bottom: 10px; font-weight: bold; }
    h2 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    h3 { font-size: 14px; margin-top: 15px; margin-bottom: 8px; font-weight: bold; }
    p { margin-bottom: 10px; text-align: justify; }
    ul, ol { margin-bottom: 10px; padding-left: 20px; }
    li { margin-bottom: 5px; }
    code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 11px; }
    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; margin-bottom: 10px; border: 1px solid #e0e0e0; }
    blockquote { border-left: 4px solid #ccc; margin: 10px 0; padding-left: 10px; color: #666; font-style: italic; }
    table {
        width: 100%;
        border-collapse: collapse; 
        margin-bottom: 15px;
        background-color: #ffffff;
        font-size: 11px; 
    }
    th {
        background-color: #f2f2f2; 
        font-weight: bold;
        text-align: left;
        color: #333;
        border: 1px solid #ddd;
        padding: 8px;
    }
    td {
        border: 1px solid #ddd;
        padding: 8px;
        vertical-align: top;
    }
    tr:nth-child(even) {
        background-color: #fafafa;
    }
    td, th {
        word-wrap: break-word;
        max-width: 300px; 
    }
`;


function preprocessMarkdown(text: string): string {
    if (!text) return "";

    let cleanText = text.replace(/([^\n])\n(\|)/g, '$1\n\n$2');

    cleanText = cleanText.replace(/([^\n])\n(#)/g, '$1\n\n$2');

    return cleanText;
}


async function createPdfBufferFromMarkdown(markdownText: string): Promise<ArrayBuffer> {
    const cleanedMarkdown = preprocessMarkdown(markdownText);

    marked.use({
        gfm: true,
        breaks: true,
    });

    const htmlContent = await marked.parse(cleanedMarkdown);

    const element = document.createElement('div');
    element.innerHTML = `
        <style>${PDF_STYLES}</style>
        <div style="padding: 20px 40px;">
            ${htmlContent}
        </div>
    `;

    const opt = {
        margin:       [10, 0, 10, 0] as [number, number, number, number],
        filename:     'temp.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    const html2pdf = (await import('html2pdf.js')).default;

    return await html2pdf().set(opt).from(element).output('arraybuffer');
}

export default async function downloadAnalysedPdf(
    analysisText: string,
    outputFilename: string
): Promise<void> {
    try {

        const analysisBuffer = await createPdfBufferFromMarkdown(analysisText);
        const analysisPdfDoc = await PDFDocument.load(analysisBuffer);


        const pdfBytes = await analysisPdfDoc.save();

        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = outputFilename.endsWith('.pdf') ? outputFilename : `${outputFilename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("Error generating merged PDF:", error);
        throw new Error("PDF Generierung fehlgeschlagen");
    }
}