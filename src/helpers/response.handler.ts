import { Request, Response as expressResponse } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

interface IResponseType {
  message: string;
  data?: object;
  code?: number;
}

/**
 * Applications response handler class
 * Handles both success and error responses using well defined methods
 * @param {object} req express request object
 * @param {object} res express response object
 *
 * @returns {object} response
 */
class ResponseHandler {
  private readonly request: Request;
  private readonly response: expressResponse;
  constructor(req: Request, res: expressResponse | any) {
    this.request = req;
    this.response = res;
  }
  /**
   * Method to Handles success responses to ensure consistency
   * @param {object} options - {message, data}
   *
   * @returns {object} - success response
   */
  success(options: IResponseType): object {
    const { message, data, code = StatusCodes.OK } = options;
    const response = {
      status: "success",
      message,
      data,
      type: getReasonPhrase(code),
    };

    return this.response.status(code).json(response);
  }

  /**
   * Method to Handles error responses to ensure consistency
   * @param {object} options - {message, data}
   *
   * @returns {object} - failure response
   */
  fail(options: IResponseType): object {
    const { message, data, code = StatusCodes.INTERNAL_SERVER_ERROR } = options;

    const response = {
      status: "error",
      message,
      data,
      type: getReasonPhrase(code),
    };

    return this.response.status(code).json(response);
  }
}

export default ResponseHandler;
