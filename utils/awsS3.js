const  {PutObjectCommand, S3Client, GetObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3")
const {awsRegion, awsAccessKey, awsSecretAccessKey, awsBucketName} = require("../config/kyes")
const generateCode = require("../utils/generateCode");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");

const client = new S3Client({
    region: awsRegion,
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretAccessKey
    }

})

const uploadFileAWS = async ({file, ext}) => {
    const key = `${generateCode(12)}_${Date.now()}${ext}`;
    const params = {
        Bucket: awsBucketName,
        body: file.buffer,
        Key: key,
        ContentType: file.mimetype
    }

    const command = new PutObjectCommand(params);

    try{
        await client.send(command);
        return key

    }catch(error){
        console.log(error);
    }
}
//  TODO : Figure out why the image is not loading 
const signedUrl = async (key) => {
    const params = {
        Bucket: awsBucketName,
        Key: key,
    }

    const command = new GetObjectCommand(params);

    try{
        const url = await getSignedUrl(client, command, {expiresIn: 60});
        return url;
    }catch(error){
        console.log(error)
    }
} 

const deleteFileFromS3 = async(key) => {
    const params = {
        Bucket: awsBucketName,
        Key: key
    }
    const command = new DeleteObjectCommand(params);
    try{
        await client.send(command);
        return;
    }catch(error){
        console.log(error);
    }
}
module.exports = {uploadFileAWS, signedUrl, deleteFileFromS3}