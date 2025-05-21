import axiosInstance from '../Config/AxiosConfig.js';

const pingServer = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/ping');
    return response.data;
  } catch (error) {
    console.error('Error pinging server:', error);
    throw error;
  }
}

export default pingServer;