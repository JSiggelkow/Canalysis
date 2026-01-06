import {PDFDocument, rgb, StandardFonts} from "pdf-lib";

export const downloadPdf = async (text: string, fileName: string) => {
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    const page = pdfDoc.addPage()
    const {width, height} = page.getSize()
    const fontSize = 12
    const margin = 50

    const maxWidth = width - 2 * margin;

    const lines = text.split('\n');
    let y = height - margin;

    let currentPage = page;

    for (const line of lines) {
        const words = line.split(' ');
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const textWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);

            if (textWidth > maxWidth) {
                if (y < margin) {
                    currentPage = pdfDoc.addPage();
                    y = height - margin;
                }
                currentPage.drawText(currentLine, {
                    x: margin,
                    y,
                    size: fontSize,
                    font: timesRomanFont,
                    color: rgb(0, 0, 0)
                });
                y -= fontSize * 1.5;
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            if (y < margin) {
                currentPage = pdfDoc.addPage();
                y = height - margin;
            }
            currentPage.drawText(currentLine, {
                x: margin,
                y,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0)
            });
            y -= fontSize * 1.5;
        }
    }

    const pdfBytes = await pdfDoc.save()

    // @ts-expect-error it is a safe cast
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}