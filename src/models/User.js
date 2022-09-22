const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is Invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 20,
        validate(value) {
            if (value <= 0) {
                throw new Error('Invalid age')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    image: {
        type: Buffer
    }
})

schema.virtual('tasks', {
    localField: '_id',
    foreignField: 'owner',
    ref: 'Task'
})

schema.pre('save', async function(){
    if (this.isModified('password')){
        this.password = await bcryptjs.hash(this.password, 8)
    }
})

schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user) {
        throw new Error("Please check your email or password")
    }
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Please check your email or password")
    }
    return user
}

schema.methods.generateToken = function(){
    const token = jwt.sign({_id: this._id.toString()}, 'nodeAPI')
    return token
}

const User = mongoose.model('User', schema)

module.exports = User