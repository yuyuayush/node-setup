# Testing Guide

This project uses **Jest** as the test runner and **Supertest** for integration testing. 

## 🚀 Getting Started

### 1. Install Dependencies
Ensure you have installed the development dependencies:
```bash
npm install
```

### 2. Run All Tests
```bash
npm test
```
This command runs all tests once and generates a coverage report in the `coverage/` directory.

### 3. Run Tests in Watch Mode
```bash
npm run test:watch
```
Useful during development. Jest will re-run tests related to changed files automatically.

## 📁 Directory Structure
Tests are located in the `tests/` directory:
- `tests/unit/`: Tests for individual functions/utilities in isolation.
- `tests/integration/`: Tests for API endpoints (Routes -> Controllers -> Services -> Database).

## 🛠️ Writing Tests

### Unit Test Example
Unit tests focus on a single unit of code.
```javascript
import pick from '../../src/utils/pick.js';

describe('Utility: pick', () => {
  test('should pick specific keys', () => {
    const obj = { a: 1, b: 2 };
    expect(pick(obj, ['a'])).toEqual({ a: 1 });
  });
});
```

### Integration Test Example
Integration tests use `supertest` to make actual HTTP requests to the app.
```javascript
import request from 'supertest';
import app from '../../src/app.js';

describe('Route: GET /api/v1/healthcheck', () => {
  test('should return 200', async () => {
    const res = await request(app).get('/api/v1/healthcheck');
    expect(res.statusCode).toBe(200);
  });
});
```

## 🧪 Key Concepts

### Matchers
Jest uses "matchers" to let you test values in different ways.
- `toBe(value)`: Exact equality (`===`).
- `toEqual(value)`: Deep equality (for objects/arrays).
- `toContain(item)`: Check if array contains item.
- `toThrow(error)`: Check if a function throws an error.

### Async/Await
For API tests or database calls, always use `async/await`.
```javascript
test('async test', async () => {
  const data = await someAsyncFunction();
  expect(data).toBeDefined();
});
```

### Setup and Teardown
If you need to do something before every test (like seeding a database):
- `beforeAll()` / `afterAll()`: Runs once per file.
- `beforeEach()` / `afterEach()`: Runs before/after every single `test()` block.

## 📊 Code Coverage
After running `npm test`, you can open `coverage/lcov-report/index.html` in your browser to see a visual map of which lines of code are covered by tests and which are not.
