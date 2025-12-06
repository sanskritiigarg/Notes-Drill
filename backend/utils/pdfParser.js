import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

/**
 * Extract text from PDF
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<{text: string, numPages: number}>}
 */

export const extractTextFromPdf = async (filePath) => {
  try {
    // buffer contains raw binary data of file, Nodejs standard
    const dataBuffer = await fs.readFile(filePath);

    // pdf-parse expects web-standard Uint8 Array, not dataBuffer
    const parser = new PDFParse(new Uint8Array(dataBuffer));
    const data = await parser.getText();

    return {
      text: data.text,
      numPages: data.numPages,
      info: data.info,
    };
  } catch (error) {
    console.error('PDF Parsing Error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
