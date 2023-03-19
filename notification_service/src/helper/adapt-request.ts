import { Request } from "express";

export type httpRequest = {
  path: String;
  method: String;
  pathParams: Object;
  queryParams: Object;
  body: Object;
};

export default function adaptRequest(req: Request): httpRequest {
  return Object.freeze({
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.query,
    body: req.body,
  });
}
