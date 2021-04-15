const bcrypt = require('bcrypt')
const generateUniqueId = require('generate-unique-id');


const saltRounds = 10


function checkNotNull(arr) {
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == null || arr[i] == undefined || arr[i] == '') {
            return false
        }
    }
    return true;
}

async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds)
}

async function checkPassword(passwordPlain, passwordHashed) {
    return await bcrypt.compare(passwordPlain, passwordHashed)
}

function getUniqueId() {
    return generateUniqueId({
        length: 20,
        useLetters: false
    })
}

function getExtensionOfFile(filename) {
    var re = /(?:\.([^.]+))?$/;
    let ext = re.exec(filename)[1]
    return ext
}

module.exports = {checkNotNull, hashPassword, checkPassword, getUniqueId, getExtensionOfFile}