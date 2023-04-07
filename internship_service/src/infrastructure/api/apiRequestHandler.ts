import axios, { AxiosInstance } from "axios";

function api(port: number): AxiosInstance {
  // Create an instance of axios
  const instance = axios.create({
    baseURL: `http://localhost:${port}`,
    timeout: 1000 * 20,
  });

  return instance;
}
let port: number;
const errorHandler = (error: any) => {
  // console.error(`error generated by axios intercepter`);
  // if (error.response) {
  //   console.error(`status: ${error.response.status}\n`, error.response.data);
  // } else {
  //   console.error(error);
  // }
  return Promise.reject(error);
};

api(port).interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

const apiRequestHandler = async (options: any, port: number) => {
  try {
    const { data, status } = await api(port).request(options);
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
