const mongoose = require('mongoose');
const Schema = mongoose.Schema
//const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        required: 'You must input an email'
    },
    encrypted_password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    address: {
       type: String,
       required: true 
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superuser'],
        default: 'user',
        required: true
    },
    image: {
        type: String,
        default: 'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
    },
    isConfirmed: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

//userSchema.plugin(uniqueValidator)

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema)
