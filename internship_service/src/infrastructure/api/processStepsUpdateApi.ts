import apiRequestHandler from "./apiRequestHandler";

const BASE_URL = "/step2";
const PORT = 5000;

export default {
  UpdateProcessStep: async (id_process: Number, step: number) => {
    if (step < 3) {
      const newStep = step + 1;
      return apiRequestHandler(
        {
          url: BASE_URL + `/update/${id_process}`,
          method: "put",
          data: { step: newStep },
          headers: {},
        },
        PORT
      );
    }
  },
  GetProcess: async (id_process: Number) => {
    return apiRequestHandler(
      {
        url: BASE_URL + `/${id_process}`,
        method: "get",
        data: {},
        headers: {},
      },
      PORT
    );
  },
};
