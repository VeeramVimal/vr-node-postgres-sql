const multer = require("multer");
const path = require('path');
const { uuid } = require('uuidv4');


const multerStorageForProfiles = multer.diskStorage({
    destination: __dirname+'../../../uploads',
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}`+ '-' + uuid() + "." + ext);    
    }
})
  
const multerFilter = (req, file, cb) => {
    return cb(null, true);
};

const profiles = multer({
    storage: multerStorageForProfiles,
    fileFilter: multerFilter,
}).any();

module.exports = {
    profiles
}
