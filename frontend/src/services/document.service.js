import { axiosInstance } from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const upload = async (formData) => {
  try {
    const response = await axiosInstance.post(API_PATHS.DOCUMENT.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    
    throw error.response?.data || { message: 'Failed to upload document' };
  }
};

const getDocuments = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENT.GET_ALL_DOCS);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch documents' };
  }
};

const getDocumentById = async (id) => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENT.DOC_BY_ID(id));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch document' };
  }
};

const deleteDoc = async (id) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.DOCUMENT.DOC_BY_ID(id));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete document' };
  }
};

const documentServices = {
  upload,
  getDocuments,
  getDocumentById,
  deleteDoc,
};

export default documentServices;
