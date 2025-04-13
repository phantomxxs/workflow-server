"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
/**
 * Applications response handler class
 * Handles both success and error responses using well defined methods
 * @param {object} req express request object
 * @param {object} res express response object
 *
 * @returns {object} response
 */
class ResponseHandler {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }
    /**
     * Method to Handles success responses to ensure consistency
     * @param {object} options - {message, data}
     *
     * @returns {object} - success response
     */
    success(options) {
        const { message, data, code = http_status_codes_1.StatusCodes.OK } = options;
        const response = {
            status: "success",
            message,
            data,
            type: (0, http_status_codes_1.getReasonPhrase)(code),
        };
        return this.response.status(code).json(response);
    }
    /**
     * Method to Handles error responses to ensure consistency
     * @param {object} options - {message, data}
     *
     * @returns {object} - failure response
     */
    fail(options) {
        const { message, data, code = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR } = options;
        const response = {
            status: "error",
            message,
            data,
            type: (0, http_status_codes_1.getReasonPhrase)(code),
        };
        return this.response.status(code).json(response);
    }
}
exports.default = ResponseHandler;
