module.exports = function(credentials) {
    if(!credentials) {
        return false;
    }

    return credentials.name == "admin" && credentials.pass == "admin";
};