import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(5000),
        CORS_ORIGIN: Joi.string().default('*').description('CORS allowed origins'),
        LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly').default('info'),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
        AWS_ACCESS_KEY_ID: Joi.string().required().description('AWS access key'),
        AWS_SECRET_ACCESS_KEY: Joi.string().required().description('AWS secret access key'),
        AWS_S3_BUCKET_NAME: Joi.string().required().description('AWS S3 bucket name'),
        AWS_REGION: Joi.string().required().description('AWS Region'),
        REDIS_URL: Joi.string().required().description('Redis URL'),
        QUEUE_NAME: Joi.string().default('mailQueue').description('BullMQ Queue name'),
        SES_SENDER: Joi.string().required().description('SES verified sender email'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    corsOrigin: envVars.CORS_ORIGIN,
    logLevel: envVars.LOG_LEVEL,
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
            // useCreateIndex: true,
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    aws: {
        accessKeyId: envVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
        s3BucketName: envVars.AWS_S3_BUCKET_NAME,
        region: envVars.AWS_REGION,
        sesSender: envVars.SES_SENDER,
    },
    redis: {
        url: envVars.REDIS_URL,
        queueName: envVars.QUEUE_NAME,
    },
    isProduction: envVars.NODE_ENV === 'production',
    isDevelopment: envVars.NODE_ENV === 'development',
};
