const userModels = require('./userModels');

const createUser = ({ userName, email, passWord }) =>
    new Promise(( resolve, reject ) => {
        userModels
        .create({userName, email, passWord})
        .then(user => resolve(user))
        .catch(err => reject(err))
    });
    
const getAllUsers = page =>
    new Promise((resolve, reject) => {
        userModels
        .find({ active: true })
        .sort({ createdAt: -1 })
        .skip((page - 1) * 20)
        .limit(20)
        .select("_id username email")
        .exec()
        .then(data =>
          resolve(
            data.map(user =>
              Object.assign({}, user._doc, {
                avatarUrl: `/api/users/${user._id}/avatar`
              })
            )
          )
        )
        .catch(err => reject(err));
    }); 

module.exports = {
    createUser,
    getAllUsers
}