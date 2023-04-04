import apiRequestHandler from "./apiRequestHandler";

const BASE_URL = "/company";

export default {
  SaveCompany: async (company_name: String) => {
    return apiRequestHandler({
      url: BASE_URL + "/add",
      method: "post",
      data: { company_name: company_name },
      headers: {},
    });
  },
  GetCompany: async (idCompany: Number) => {
    return apiRequestHandler({
      url: BASE_URL + `/${idCompany}`,
      method: "get",
      data: {},
      headers: {},
    });
  },
};
