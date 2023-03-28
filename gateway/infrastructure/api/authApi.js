import apiRequestHandler from "./apiRequestHandler.js";

const BASE_URL = "/auth";

export default {
  VerifyToken: async (token) => {
    return apiRequestHandler({
      url: BASE_URL + "/verifyToken",
      method: "post",
      data: {},
      headers: {
        'authorization': token,
        'Content-Type': 'application/json'
      },
    });
  },
};
