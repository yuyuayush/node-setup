import pick from '../../src/utils/pick.js';

describe('pick utility', () => {
    test('should pick specified keys from an object', () => {
        const object = { a: 1, b: 2, c: 3 };
        const keys = ['a', 'c'];
        const result = pick(object, keys);
        expect(result).toEqual({ a: 1, c: 3 });
    });

    test('should ignore keys that do not exist', () => {
        const object = { a: 1, b: 2 };
        const keys = ['a', 'z'];
        const result = pick(object, keys);
        expect(result).toEqual({ a: 1 });
    });

    test('should return an empty object if no keys are provided', () => {
        const object = { a: 1, b: 2 };
        const keys = [];
        const result = pick(object, keys);
        expect(result).toEqual({});
    });
});
