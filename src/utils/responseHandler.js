import { ApiResponse } from "./ApiResponse.js";


const successResponse = (res, data, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};


const createdResponse = (res, data, message = "Resource created successfully") => {
    return res.status(201).json(new ApiResponse(201, data, message));
};


const noContentResponse = (res) => {
    return res.status(204).send();
};

const errorResponse = (res, statusCode, message = "Something went wrong", errors = []) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
        data: null
    });
};

export { successResponse, createdResponse, noContentResponse, errorResponse };
