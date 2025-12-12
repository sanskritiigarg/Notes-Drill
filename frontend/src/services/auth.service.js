import { axiosInstance } from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw error.data || { error: 'An unknown error occurred' };
  }
};

const register = async (username, email, password) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw error.data || { error: 'An unknown error occurred' };
  }
};

const getProfile = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.PROFILE);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

const updateProfile = async (userData) => {
  try {
    const response = await axiosInstance.put(API_PATHS.AUTH.PROFILE, userData);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

const updatePassword = async (passwords) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.AUTH.UPDATE_PASSWORD, passwords);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

const authService = {
  login,
  register,
  getProfile,
  updateProfile,
  updatePassword,
};

export default authService;
