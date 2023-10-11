const hashed_password = require('bcryptjs')


const HashedPassword = (password) => {

    return hashed_password.hashSync(password,10)

}

const ComparePassword =(password,hashedpass) => {
    return hashed_password.compareSync (password,hashedpass)
}

module.exports = {
    HashedPassword,
    ComparePassword
}