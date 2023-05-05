import axios from "axios";
import FormData from "form-data";
import Authentication from "./AuthenticationVerifier.js";
import logger from "./Logger.js"

export default class RequestHandler {

  async callService(method, data, url, headers, files) {
    const config = {
      method,
      url,
      headers: { ...headers }
    };

    if (files) {
      const formData = new FormData();
      Object.keys(data).forEach((f) => {
        formData.append(f, data[f]);
      });
      Object.keys(files).forEach((f) => {
        if (Array.isArray(files[f]))
          files[f].forEach((i) => formData.append(f, i.data, i.name));
        else formData.append(f, files[f].data, files[f].name);
      });
      config.headers["Content-Type"] = "multipart/form-data";
      config.data = formData;
      return await axios.post(url, formData, config);
    } else {
      config.data = data;
      return await axios(config);
    }
  };

  async requestFile(req, res, path, service) {
    const { body, method, headers } = req;
    delete headers["content-length"];

    const { data, headers: responseHeaders, status } = await axios({
      method,
      data: body,
      url: `http://${service.ip}:${service.port}/${path}`,
      headers,
      responseType: "stream",
    });

    Object.entries(responseHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return { data, status };
  };


  getMatchedEndpoint(endpoints, path, reqMethod) {
    const resource = path.split('/').filter(Boolean);

    for (const endpoint of endpoints) {
      const { path, method, params } = endpoint;

      let pathParams = path.split('/').filter(Boolean);

      if (method === reqMethod && pathParams.length === resource.length) {

        const paramMap = {};
        const matches = pathParams.every((param, index) => {
          if (param.startsWith(':')) {
            paramMap[param.slice(1)] = resource[index];
            return true;
          } else {
            return param === resource[index];
          }
        });
        if (matches) return endpoint
      }
    }
    return null
  }

  async #authCheck(endpoint, token) {
    if (endpoint.auth?.type === "jwt") {
      const isAuth = await Authentication.verifyJWT(token)
      if (!isAuth) {
        logger.error(`Unauthorized access: route: ${endpoint}`)
        return {
          data: { message: 'Unauthorized' },
          status: 401
        }
      }
      if (!endpoint.auth.roles.includes(isAuth.user.role)) {
        logger.error(`Forbidden access: route: ${endpoint}, userId: ${isAuth.user.id}`)

        return {
          data: { message: 'Forbidden' },
          status: 403
        }
      }
      return { user: isAuth.user }
    }
  }

  async routingRequest(req, res, path, service) {
    delete req.headers["content-length"];
    const endpoint = this.getMatchedEndpoint(service.endpoints, path, req.method)
    if (!endpoint)
      return {
        data: {
          message: "endpoint no found",
        },
        status: 404,
      };
    if (endpoint.auth) {
      const { user, data, status } = this.#authCheck(endpoint, req.headers.authorization)
      console.log(data, status, user)
      if (!user) return { data, status }
      req.body.user = user;
    }

    try {
      // throw Error("Booya 🐛")
      console.log(`http://${service.ip}:${service.port}/${path}`)
      const { data, headers, status } = await this.callService(
        req.method,
        req.body,
        `http://${service.ip}:${service.port}/${path}`,
        req.headers,
        req.files
      );
      Object.keys(headers).forEach((h) => {
        res.setHeader(h, headers[h]);
      });
      return { data, status };
    } catch (err) {
      console.log(err)
      return { status: 503 };
    }

  };
}
