import { axiosInstance } from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const getAllQuizzes = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZ.GET_QUIZ_FOR_DOC(documentId));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch quiz' };
  }
};

const getQuizById = async (id) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZ.GET_QUIZ_FOR_DOC(id));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch quiz' };
  }
};

const submitQuiz = async (id, answers) => {
  try {
    const response = await axiosInstance.post(API_PATHS.QUIZ.GET_QUIZ_FOR_DOC(id), { answers });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit quiz' };
  }
};

const getQuizResults = async (id) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZ.GET_QUIZ_FOR_DOC(id));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch quiz results' };
  }
};

const deleteQuiz = async (id) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.QUIZ.GET_QUIZ_FOR_DOC(id));

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete quiz' };
  }
};

const quizService = {
  getAllQuizzes,
  getQuizById,
  getQuizResults,
  submitQuiz,
  deleteQuiz,
};
