import { ApiError } from '../../src/utils/ApiError.js';

describe('ApiError utility', () => {
    test('should correctly set the status code and message', () => {
        const error = new ApiError(400, 'Bad Request');
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Bad Request');
        expect(error.success).toBe(false);
    });

    test('should include custom errors array', () => {
        const errors = ['error1', 'error2'];
        const error = new ApiError(400, 'Bad Request', errors);
        expect(error.errors).toEqual(errors);
    });

    test('should capture stack trace', () => {
        const error = new ApiError(500, 'Server Error');
        expect(error.stack).toBeDefined();
    });
});
