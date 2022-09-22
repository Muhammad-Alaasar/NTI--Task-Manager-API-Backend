const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {

try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decode = jwt.verify(token, 'nodeAPI')
    const user = await User.findById({_id: decode._id})
    req.user = user
    next()
} catch(e) {
    res.send({error: 'Please Authenticate'})
}

}

module.exports = auth