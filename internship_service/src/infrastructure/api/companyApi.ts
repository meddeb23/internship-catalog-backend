import apiRequestHandler from "./apiRequestHandler";

const BASE_URL = "/company";
const PORT = 5001;

export default {
  SaveCompany: async (company_name: String) => {
    return apiRequestHandler(
      {
        url: BASE_URL + "/add",
        method: "post",
        data: { company_name: company_name },
        headers: {},
      },
      PORT
    );
  },
  GetCompany: async (idCompany: Number) => {
    return apiRequestHandler(
      {
        url: BASE_URL + `/${idCompany}`,
        method: "get",
        data: {},
        headers: {},
      },
      PORT
    );
  },
};
