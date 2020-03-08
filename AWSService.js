const aws = require('aws-sdk');
const Blob = require('blob');

aws.config.region = 'us-east-2';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const S3_BUCKET = process.env.S3_BUCKET;

const convertToBase64 = (buffer) => {
  const imagePrefix = 'data:image/jpg;base64,';
  const base64 = Buffer.from(buffer).toString('base64');
  return imagePrefix + base64;
}


const getResource = async (key) => {
  const options = { Bucket: S3_BUCKET, Key: key }
  try {
    const data = await s3.getObject(options).promise();
    return data.Body;
  } catch (error) {
    return undefined;
  }
}

const uploadResource = async (key, file) => {
  const options = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  }

  try {
    const data = await s3.upload(options).promise();
    return data;
  } catch (error) {
    return undefined;
  }
}

module.exports = {
  convertToBase64,
  getResource,
  uploadResource
}
