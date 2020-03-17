const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
const { success, failed, successMessage, failedMessage } = require('../helpers/response');
const mailer = require('../services/mailer')
const Imagekit = require('imagekit')

const imagekitInstance = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}`
});

// user register
exports.userRegister = async (req, res) => {
    const { full_name, email, password, password_confirmation, bio, gender, address} = req.body

    try {
        if (password != password_confirmation) return failedMessage(
            res, 'Password doesn\'t match', 422)
        
        const salt = await bcrypt.genSalt(10)
        const encrypted_password = await bcrypt.hash(password, salt)

        const users = await User.find()
        let user
        if(users.length <1) {
            user = await User.create({ full_name, email, encrypted_password, bio, gender, address, role: 'superuser'})
        } else {
            user = await User.create({ full_name, email, encrypted_password, bio, gender, address})
        }

        const token = jwt.sign({ _id: user._id, role: user.role}, process.env.SECRET_KEY )

        if (!process.env.ENVIRONMENT === 'TESTING') {
            mailer.send({
                from: 'no-reply@DesaSehat.com',
                to: user.email,
                subject: 'User Activation',
                html: `
                <p> Hei, ${user.name}. Please click on the link below to verify your email and continue the registration process.</p>
                <a href="${process.env.BASE_URL}/api/user/activation/${token}">Click here</a>`
            })
        }

        success(res, 'A verification link has been sent to your email account. Please click on the link that has just been sent to your email account to verify your email and continue the registration process.', { ...user._doc, token, encrypted_password: undefined}, 201)
    } catch (err) {
        failedMessage(res, err, 422)
    }
}


// activate user
exports.activation = (req, res) => {
    let user = jwt.verify(req.params.token, process.env.SECRET_KEY)

    User.findOneAndUpdate({ _id: user._id }, { isConfirmed: true })
        .then(data => {
            success(res, 'Your email is verified now.', data, 201)
        })
        .catch(err => failedMessage(res, err, 422))
}

// login user
exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(data => {
            if (!data) return failedMessage(
                res, `That email and password combination didn't work. Try again.`, 403)
            if (!bcrypt.compareSync(req.body.password, data.encrypted_password)) return failedMessage(
                res, `That email and password combination didn't work. Try again.`, 403)

            // if (!data.isConfirmed) return failedMessage(
            //     res, 'Email isn\'t verified, please check your email!', 403)

            success(res, 'Successfuly login', {
                _id: data._id,
                role: data.role,
                full_name: data.full_name,
                email: data.email,
                bio: data.bio,
                image: data.image,
                token: jwt.sign({ _id: data._id, role: data.role }, process.env.SECRET_KEY)
            }, 200)
        })
        .catch(err => failedMessage(res, err, 422))
}

// request link to change password
exports.forgot = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(data => {
            let token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY, {expiresIn: '1d'})
            mailer.send({
                from: 'no-reply@DesaSehat.com',
                to: data.email,
                subject: 'Reset password',
                html: `
          <p> Hai, ${data.name}. segera ganti password anda dengan menekan tombol dibawah.</p>
          <a href="${process.env.BASE_URL}/api/user/resetPassword/${token}">Click here</a>`
            })
            return token
        })
        .then(result => {
            success(res, `You will receive an email with a link to reset your password.`, result, 200)
        })
        .catch(err => failedMessage(res, err, 422))
}

// reset password // done
exports.reset = (req, res) => {
    let user = jwt.verify(req.params.token, process.env.SECRET_KEY)

    if (req.body.password != req.body.password_confirmation) return failedMessage(
        res, 'Password doesn\'t match!', 403)

    User.findOneAndUpdate({ _id: user._id }, { password: bcrypt.hashSync(req.body.password) })
        .then(data => success(res, 'successfully changed password', data, 201))
        .catch(err => failedMessage(res, err, 422))
}

// update picture profile
exports.upload = (req, res) => {
    imagekitInstance
        .upload({
            file: req.file.buffer.toString("base64"),
            fileName: `IMG-${Date()}`
        })
        .then(async data => {
            User.findOneAndUpdate({ _id: req.user._id }, { image: data.url }, (error, document, result) => {
                let newResponse = {
                    ...document._doc,
                    image: data.url
                }
                delete newResponse.password
                success(res, `successfully updated profile`, newResponse, 200)
            })
        })
        .catch(err => {
            res.status(422).json({
                status: false,
                errors: err
            })
        })
}

// edit profile // done
exports.editProfile = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    User.findOneAndUpdate({ _id: user._id }, { $set: { ...req.body}}, {new: true})
        .select(['-encrypted_password'])
        .then(data => {
            success(res, 'successfully update profile', { ...data._doc, full_name: req.body.full_name, token: jwt.sign({ _id: data._id, role: data.role }, process.env.SECRET_KEY )}, 200)
        })
        .catch(err => failedMessage(res, err, 422))
}

// user profile // done
exports.userProfile = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    User.findOne({ _id: user._id })
        .then(data => success(res, 'success get user profile', data, 200))
        .catch(err => failedMessage(res, err, 422))
}

// get all users - only superuser and admin could do this acton
exports.getAll = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    if (req.user.role == 'user') return failedMessage(
        res, 'You are not authorized to do this action', 403)
    User.find().select(['-encrypted_password'])
        .then(data => success(res, 'success get all users profile', data, 200))
        .catch(err => failedMessage(res, err, 422))
}

//delete current user
exports.delete = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    User.findByIdAndDelete(req.user._id).select(['-encrypted_password'])
        .then(data => success(res, 'success delete user profile', undefined, 200))
        .catch(err => failedMessage(res, err, 422))
}

//change user's role - only superuser could do this action!
exports.changeRole = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    if (req.user.role == 'user') return failedMessage(
        res, 'You are not authorized to do this action', 403)
    User.findByIdAndUpdate(req.params._id, { $set: { role: req.body.role}}, {new: true})
        .select(['-encrypted_password'])
        .then(data => {
            success(res, 'successfully change role', { ...data._doc, full_name: req.body.full_name, token: jwt.sign({ _id: data._id, role: data.role }, process.env.SECRET_KEY) }, 200)
        })
        .catch(err => failedMessage(res, err, 422))
}