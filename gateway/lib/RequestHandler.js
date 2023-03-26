import axios from "axios";
import FormData from "form-data";
const callService = async (method, data, url, headers, files) => {
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
    // formData.append("file", files.file.data, files.file.name);
    return await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...headers,
      },
    });
  } else {
    return await axios({ method, data, url, headers });
  }
};

export const requestFile = async (req, res, path, service) => {
  delete req.headers["content-length"];
  const { data, headers, status } = await axios({
    method: req.method,
    data: req.body,
    url: `http://${service.ip}:${service.port}/${path}`,
    headers: req.headers,
    responseType: "stream",
  });
  Object.keys(headers).forEach((h) => {
    res.setHeader(h, headers[h]);
  });
  return { data, status };
};

export const routingRequest = async (req, res, path, service) => {
  delete req.headers["content-length"];
  // const endpoint = service.endpoints.find(
  //   (i) => i.path === path && i.method === req.method
  // );
  // if (!endpoint)
  //   return {
  //     data: {
  //       message: "Service no found",
  //       status: 404,
  //     },
  //   };

  const { data, headers, status } = await callService(
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
};
