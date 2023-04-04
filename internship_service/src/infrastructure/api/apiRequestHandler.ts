import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001",
  timeout: 1000 * 20,
});

const errorHandler = (error: any) => {
  // console.error(`error generated by axios intercepter`);
  // if (error.response) {
  //   console.error(`status: ${error.response.status}\n`, error.response.data);
  // } else {
  //   console.error(error);
  // }
  return Promise.reject(error);
};

api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

const apiRequestHandler = async (options: any) => {
  try {
    const { data, status } = await api.request(options);
    return [{ data, status }, null];
  } catch (error) {
    if (error.response) {
      return [
        {
          status: error.response.status,
          data: error.response.data,
        },
        null,
      ];
    } else {
      return [{}, error];
    }
  }
};

export default apiRequestHandler;
