const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const secret = "ExchangePasswordExchangePassword"; // must have 32 bytes


const resizedIV = "ExchangePassword"

/**
 * Sign the payload and return the token string
 *
 * @param {Object} payload
 * @return {string} 
 */
const sign = (payload) => {
    return jwt.sign(payload, secret, {
        expiresIn: '60m'
    })
}

/**
 * Validate the token and the return authObject. If also pass userId parameter, check it too
 *
 * @param {string} token
 * @param {string} userId
 * @return {Object} 
 */
const validate = (token, userId) => {
    try {

        jwt.verify(token, secret);
        const authObject = jwt.decode(token);
        if (userId) {
            if (userId !== authObject.user_id) {
                throw new Error("Permission Denied");
            }
        }
        return authObject;
    } catch (err) {
        throw err;
    }
}

/**
 * Create hash string for the string parameter
 *
 * @param {string} plainText
 * @return {string} 
 */
const createHash = plainText => {
    return crypto.createHmac('sha256', secret).update(plainText).digest('hex');
}

/**
 * Create ciphered string given plain text
 *
 * @param {string} plainText
 * @return {string} 
 */
const encrypt = plainText => {
    const cipher = crypto.createCipheriv('aes-256-cbc', secret, resizedIV);
    return cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');

}

/**
 *
 *
 * @param {string} cipheredText
 * @return {string} 
 */
const decrypt = cipheredText => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secret, resizedIV);
    // decipher.setAutoPadding(false);
    return decipher.update(cipheredText, 'hex', 'utf8') + decipher.final('utf8');

}

/**
 * Create timestamp string given date
 *
 * @param {Date} date
 * @return {string} 
 */
const convert_to_timestamp = (date) => {
    const utc = moment(date).unix();
    return moment.unix(utc).format('YYYY-MM-DD HH:mm:ss');
}

module.exports = {
    sign,
    validate,
    createHash,
    encrypt,
    decrypt,
    convert_to_timestamp
}