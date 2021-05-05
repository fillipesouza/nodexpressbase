const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const mime = require('mime-types');
const { errors } = require('celebrate');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/tmp/server-uploads')
    },
    filename: function(req, file, cb) {
        const extension = mime.extension(file.mimetype);
        const tempName = `${file.fieldname}-${Date.now()}.${extension}`;
        req['upload-temp-name'] = tempName;
        cb(null, tempName)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const imageUpload = multer({ storage, fileFilter });
const fileUpload = multer({ storage });

/**
 * Class that contains all server attributes
 *
 * @class Server
 */
class Server {
    constructor(name, port) {
        this.name = name;
        this.port = port;
        this.app = express();
    }

    init(routes) {
        this.app.use(cors())
            .use(express.json())
            .use(morgan("combined"))
            .use(errors())
            .use(routes)
            .listen(this.port, () => {
                `Server ${this.name} has started`
            })
    }
}

module.exports = {
    Server,
    imageUpload,
    fileUpload
};