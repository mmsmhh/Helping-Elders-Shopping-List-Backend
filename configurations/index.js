const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET: process.env.SECRET,
    AWS_SMTP_HOST: process.env.AWS_SMTP_HOST,
    AWS_SMTP_USERNAME: process.env.AWS_SMTP_USERNAME,
    AWS_SMTP_PASSWORD: process.env.AWS_SMTP_PASSWORD,
    AWS_SECRET_ACCESS: process.env.AWS_SECRET_ACCESS,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    AWS_SMTP_PORT: process.env.AWS_SMTP_PORT
};