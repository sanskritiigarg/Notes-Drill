import { axiosInstance } from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const getDashboard = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.PROGRESS.DASHBOARD);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get progress' };
  }
};

const progressService = {
  getDashboard,
};

export default progressService;
