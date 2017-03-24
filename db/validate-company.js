
var validateVarChar = function(field,maxLength,regex) {
    if(!field) return false;
    if(field.length > maxLength) return false;
    if(regex) {
        if(!field.match(regex)) return false;
    }
    return true;
};

module.exports = function(company) {
    var errors = [];
    if(!validateVarChar(company.name, 100)) {
        errors.push("name is required, and cannot be longer than 100 characters.");
    }
    if(!validateVarChar(company.address, 100)) {
        errors.push("address is required, and cannot be longer than 100 characters.");
    }
    if(!validateVarChar(company.id13, 13, /^\d{13}$/)) {
        errors.push("id13 is required, and must consist of 13 digits");
    }
    if(!validateVarChar(company.taxbr, 5)) {
        errors.push("taxbr is required, and cannot be longer than 5 characters");
    }
    if(!validateVarChar(company.owner, 100)) {
        errors.push("owner is required, and cannot be no longer than 100 characters");
    }
    if(!company.partner) {
        company.partner = "";
    } else if(!validateVarChar(company.partner, 100)) {
        errors.push("partner is required, and cannot be longer than 100 characters");
    }
    if(!validateVarChar(company.code,10)) {
        errors.push("code is required, and cannot be longer than 10 characters");
    }

    if(!company.type) {
        errors.push("type is required");
    }

    if(!company.year) {
        errors.push("year is required");        
    }
    return errors;
}