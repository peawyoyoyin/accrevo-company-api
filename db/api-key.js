var uuid = require('uuid/v1');

module.exports.getByUUID = function() {
    return uuid();
};