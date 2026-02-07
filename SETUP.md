# Professional Node.js Project Setup

This project has been upgraded to a production-ready ("10+ years experience") architecture.

## 🚀 Key Improvements

### 1. Robust Configuration Management (`src/config/index.js`)
- **Strict Validation**: Utilizing `Joi` to validate environment variables on startup. The app will fail fast if critical configs (like `PORT` or `DB_URL`) are missing.
- **Centralized Config**: A single source of truth for all configuration values.

### 2. Advanced Logging System (`src/config/logger.js`)
- **Log Rotation**: Logs are automatically rotated daily using `winston-daily-rotate-file` to prevent disk overflow.
- **Environment Aware**:
  - **Development**: Colorized, readable console logs.
  - **Production**: Structured JSON logs for easy ingestion by monitoring tools (ELK, Datadog).
- **Error Capture**: Automatically captures unhandled rejections and exceptions.

### 3. Enterprise-Grade Security (`src/app.js`)
- **Helmet**: Adds secure HTTP headers to protect against common attacks (XSS, sniff, etc.).
- **Rate Limiting**: Protects against brute-force and DDoS attacks.
- **HPP**: Protects against HTTP Parameter Pollution.
- **CORS**: Configured for secure cross-origin resource sharing.

### 4. Performance Optimization (`src/app.js`)
- **Compression**: Gzip compression for all responses to reduce bandwidth usage and improve speed.

### 5. Graceful Shutdown (`server.js`)
- Handles `SIGTERM` and `SIGINT` signals to close the server and database connections gracefully, ensuring no requests are dropped mid-processing.

## 🛠 Usage

- **Development**:
  ```bash
  npm run dev
  ```
  Runs with `nodemon` and pretty logs.

- **Production**:
  ```bash
  npm start
  ```
  Runs with `node`, JSON logs, and production optimizations.

## 📂 New File Structure Details
- `logs/`: Contains rotated log files (error vs combined).
- `src/config/`: Configuration logic.
- `src/middleware/`: Security and logging middleware.
