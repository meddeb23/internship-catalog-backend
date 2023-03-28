type EnterpriseRepositoryError = {
  message: string;
  value?: string;
};

export default class RepoError extends Error {
  stack?: string;
  response?: Array<EnterpriseRepositoryError>;
  constructor(
    message: string,
    stack?: string,
    response?: Array<EnterpriseRepositoryError>
  ) {
    super(message);
    this.stack = stack || "";
    this.response = response || [];
  }
}
