import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs'; // Make sure to import fs

var imagekit = new ImageKit({
  publicKey: process.env.KIT_PUBLIC_KEY,
  privateKey: process.env.KIT_PRIVATE_KEY,
  urlEndpoint: process.env.KIT_ENDPOINT,
});

export const upload = async (filePath) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const result = await imagekit.upload({
      file: fileStream,
      fileName: `doc_${Date.now()}.pdf`,
      folder: '/documents',
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    throw new Error('File cannot be uploaded');
  }
};

export const deleteFile = async (fileId) => {
  try {
    const result = await imagekit.deleteFile(fileId);
    return result;
  } catch (error) {
    console.error('ImageKit Delete Error:', error);
    throw new Error('Could not delete file from cloud storage');
  }
};
