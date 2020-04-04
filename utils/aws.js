const aws = require('aws-sdk')
const config = require('../configurations');

aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS,
    accessKeyId: config.AWS_ACCESS_KEY,
    region: config.AWS_REGION
});

const S3 = new aws.S3();

const SNS = new aws.SNS();

module.exports = {
    S3,
    SNS
}