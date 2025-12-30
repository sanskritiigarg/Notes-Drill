import { axiosInstance } from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const getAllFlashcards = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FOR_USER);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch flashcards' };
  }
};

const getFlashcards = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FOR_DOC(documentId));

    return response.data;
  } catch (error) {
    console.log(error);

    throw error.response?.data?.error || { message: 'Failed to fetch flashcards' };
  }
};

const reviewFlashcard = async (cardId) => {
  try {
    const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to review flashcard' };
  }
};

const starFlashcard = async (cardId) => {
  try {
    const response = await axiosInstance.put(API_PATHS.FLASHCARDS.STAR_FLASHCARD(cardId));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to star flashcard' };
  }
};

const deleteFlashcard = async (id) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE(id));

    return response.data;
  } catch (error) {
    console.log(error);

    throw error.response?.data?.error || { message: 'Failed to delete flashcard' };
  }
};

const flashcardService = {
  getAllFlashcards,
  getFlashcards,
  reviewFlashcard,
  starFlashcard,
  deleteFlashcard,
};

export default flashcardService;
