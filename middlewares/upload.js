const multer = require("multer");
const path = require("path");
const generateCode = require("../utils/generateCode")


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads")
    }, 
    filename: (req, file, callback) => {
       // original_file_name_12_digit_random_number.ext
       const originalName = file.originalname;
       const extension = path.extname(originalName);
       const fileName = originalName.replace(extension, "");
       const compressedFileName = fileName.split(" ").join("_");
       const lowercaseFilename = compressedFileName.toLocaleLowerCase();
       const code = generateCode(12);
       const finalFile = `${lowercaseFilename}_${code}${extension}`;

       callback(null, finalFile);
    }
})
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        const mimeType = file.mimetype;
        if(mimeType === "image/jpg" || mimeType === "image/jpeg" || mimeType === "image/png" || mimeType === "application/pdf"){
            callback(null, true);
        }else {
            callback(new Error("only .jpeg or .png or .jpg or .pdf fromat is allowed"), );
        }
        
    }
});

module.exports = upload;