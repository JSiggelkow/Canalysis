// services/pdfService.ts
import { PDFDocument } from 'pdf-lib';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';

const PDF_STYLES = `
    /* Basis-Styles */
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
        border-collapse: collapse; /* Wichtig für saubere Rahmen */
        margin-bottom: 15px;
        background-color: #ffffff;
        font-size: 11px; /* Etwas kleinerer Text in Tabellen spart Platz */
    }
    th {
        background-color: #f2f2f2; /* Hellgrauer Hintergrund für Header */
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


async function createPdfBufferFromMarkdown(markdownText: string): Promise<ArrayBuffer> {
    const htmlContent = await marked.parse(markdownText);

    const element = document.createElement('div');
    element.innerHTML = `
        <style>${PDF_STYLES}</style>
        <div style="padding: 40px;">
            ${htmlContent}
        </div>
    `;

    const opt = {
        margin:       0,
        filename:     'temp.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

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

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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