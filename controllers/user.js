const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const moment = require("moment");
const { SNS, S3 } = require('../utils/aws');
const config = require("../configurations");
const randomize = require('randomatic');


const transporter = nodemailer.createTransport({
    host: config.AWS_SMTP_HOST,
    secureConnection: true,
    port: config.AWS_SMTP_PORT,
    auth: {
        user: config.AWS_SMTP_USERNAME,
        pass: config.AWS_SMTP_PASSWORD
    }
});

signToken = user => {
    return JWT.sign(
        {
            iss: "Cyyann",
            id: user._id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 100)
        },
        config.SECRET
    );
};

hashPassword = async password => {
    try {
        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(password, salt);

        return passwordHash;

    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    signUp: async (req, res) => {

        // {
        //   "name":{
        //     "firstName":"Mahmoud",
        //     "lastName":"Saleh"
        //   },
        //   "email":"mmsmhh@gmail.com",
        //   "password":"01229999660",
        //   "birthdate": "04-30-1997",
        //   "gender": "Male"
        // }

        const isEmailTaken = await User.findOne({ 'email.value': req.body.email });

        if (isEmailTaken) {
            return res.status(401).json({
                err: null,
                msg: "This email already exists.",
                data: null
            });
        }

        const hashedPassword = await hashPassword(req.body.password);

        const newEmailVerificationToken = randomize('0', 6);

        const newUser = new User({
            name: {
                firstName: req.body.name.firstName,
                lastName: req.body.name.lastName
            },
            email: {
                value: req.body.email,
                isVerified: true,
                emailVerificationToken: newEmailVerificationToken
            },
            password: {
                value: hashedPassword
            },
            birthdate: req.body.birthdate,
            gender: req.body.gender
        });

        await newUser.save();

        // const token = await encrypt(newUser.email.value + '$' + newEmailVerificationToken);

        // const mailoption = {
        //     from: "NoReply@cyyann.com",
        //     to: req.body.email,
        //     subject: "Please verify your email",
        //     text: `Your verification code is ${config.FRONTEND}/verify-email/${token}.`
        // };

        // await transporter.sendMail(mailoption);

        return res.status(200).json({
            err: null,
            msg: "Your account is created successfully, Please verify your email.",
            data: null
        });
    },
    signIn: async (req, res) => {

        // {
        //   "email":"mmsmhh@gmail.com",
        //   "password":"01229999660"
        // }

        const user = await User.findOne({ 'email.value': req.body.email });

        if (!user) {
            return res.status(404).json({
                err: null,
                msg: "No account is associated with this email.",
                data: null
            });
        }

        const isPasswordCorrect = await user.isValidPassword(req.body.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                err: null,
                msg: "Password is incorrect.",
                data: null
            });
        }

        if (!user.email.isVerified) {

            const token = encrypt(user.email.value + '$' + newEmailVerificationToken);

            const mailoption = {
                from: "NoReply@cyyann.com",
                to: req.body.email,
                subject: "Please verify your email",
                text: `Your verification code is ${config.FRONTEND}/verify-email/${token}.`
            };

            await transporter.sendMail(mailoption);

            return res.status(401).json({
                err: null,
                msg: "Your email is not verified, Please check your email.",
                data: null
            });
        }

        const token = await signToken(user);

        return res.status(200).json({
            err: null,
            msg: `You signed in successfully.`,
            data: {
                token: token,
                id: user.id
            }
        });
    },
    verifyEmail: async (req, res) => {

        // {
        //   "email":"mmsmhh@gmail.com",
        //   "emailVerificationToken": "568244"
        // }

        const user = await User.findOne({ 'email.value': req.body.email });

        if (!user) {
            return res.status(404).json({
                err: null,
                msg: "No account is associated with this email.",
                data: null
            });
        }

        if (user.email.isVerified) {
            return res.status(200).json({
                err: null,
                msg: "Your email is already verified, You can now login.",
                data: null
            });
        }

        if (user.email.emailVerificationToken == req.body.emailVerificationToken) {

            user.email.isVerified = true;

            user.email.emailVerificationToken = undefined;

            await user.save();

            return res.status(200).json({
                err: null,
                msg: `Your email is verified successfully, You can now login.`,
                data: null
            });
        }
        else {
            return res.status(401).json({
                err: null,
                msg: "Verification token is incorrect, Please check your email.",
                data: null
            });
        }
    },
    updateProfilePicture: async (req, res) => {

        const image = req.file;

        if (!image) {
            return res.status(402).json({
                err: null,
                msg: `Please upload valid image to update your profile picture.`,
                data: null
            });
        }
        else {

            const user = await User.findById(req.user.id);

            if (user.photo) {
                S3.deleteObject({ Bucket: config.S3_BUCKET_NAME, Key: user.photo }, (err) => { });
            }

            user.photo = image.key

            await user.save();

            return res.status(200).json({
                err: null,
                msg: `Profile picture updated successfully.`,
                data: image.location
            });
        }
    },
    removeProfilePicture: async (req, res) => {

        const user = await User.findById(req.user.id);

        if (!user.photo) {
            return res.status(200).json({
                err: null,
                msg: `You have no profile picture to remove it.`,
                data: null
            });
        }

        S3.deleteObject({ Bucket: config.S3_BUCKET_NAME, Key: user.photo }, (err) => { });

        user.photo = undefined

        await user.save();

        return res.status(200).json({
            err: null,
            msg: `Profile picture removed successfully.`,
            data: null
        });

    },
    updatePhoneNumber: async (req, res) => {

        // {
        //   "phoneNumber": 201229999660
        // }

        const phoneNumberVerificationToken = randomize('0', 6);

        const user = await User.findById(req.user.id);

        user.phoneNumber = {
            phoneNumberVerificationToken: phoneNumberVerificationToken,
            isVerified: false,
            value: req.body.phoneNumber
        };

        await user.save();

        message = `Your verification code is ${phoneNumberVerificationToken}`;

        const sendSMS = SNS.publish({ Message: message, Subject: 'Cyyann', PhoneNumber: '+' + req.body.phoneNumber }).promise();

        sendSMS.then(
            function (data) {
                return res.status(200).json({
                    err: null,
                    msg: `You phone number is updated succesfully, Please verify your phone number.`,
                    data: null
                });
            }).catch(
                function (err) {
                    return res.status(404).json({
                        err: err,
                        msg: `An error occured while updating your phone number, Please try again.`,
                        data: null
                    });
                });


    },
    verifyPhoneNumber: async (req, res) => {

        // {
        //   "phoneNumberVerificationToken": 924099
        // }

        const user = await User.findById(req.user.id);

        if (!user.phoneNumber) {
            return res.status(404).json({
                err: null,
                msg: `You have no phone number to verify it.`,
                data: null
            });
        }

        if (user.phoneNumber.phoneNumberVerificationToken != req.body.phoneNumberVerificationToken) {
            return res.status(401).json({
                err: null,
                msg: `Wrong verfication number, Please try again.`,
                data: null
            });
        }

        user.phoneNumber.isVerified = true;

        user.phoneNumber.phoneNumberVerificationToken = undefined;

        await user.save();

        return res.status(200).json({
            err: null,
            msg: `Your phone number is verified successfully.`,
            data: null
        });

    },
    forgetPassword: async (req, res) => {

        // {
        //   "email": "mmsmhh@gmail.com"
        // }

        const userEmail = (req.body.email).toLowerCase();

        const user = await User.findOne({ 'email.value': userEmail });

        if (!user) {
            return res.status(404).json({
                err: null,
                msg: "No user exists with the provided email.",
                data: null
            });
        }

        if (user.password.passwordResetToken && moment(user.password.passwordResetToken.expires).isAfter(moment().utc())) {

            return res.status(429).json({
                err: null,
                msg: "Reset email already sent, Please check your mailbox.",
                data: moment(user.password.passwordResetToken.expires).diff(moment().utc(), "m")
            });

        } else {

            const newPasswordResetToken = {
                value: randomize('0', 6),
                expires: moment().add(1, "h").utc().valueOf()
            };

            user.password.passwordResetToken = newPasswordResetToken;

            await user.save();


            const token = encrypt(user.email.value + '$' + user.password.passwordResetToken);

            const mailoption = {
                from: "NoReply@cyyann.com",
                to: userEmail,
                subject: "Password reset",
                text: `to reset your password ${config.FRONTEND}/verify-email/${token}.`
            };

            await transporter.sendMail(mailoption);

            return res.status(200).json({
                err: null,
                msg: "Password reset email sent successfully!",
                data: null
            });

        }

    },
    resetPassword: async (req, res) => {

        // {
        //   "email": "mmsmhh@gmail.com",
        //   "password": "01229999660",
        //   "passwordResetToken": 144252
        // }

        const userEmail = (req.body.email).toLowerCase();

        const newPassword = req.body.password;

        const passwordResetToken = req.body.passwordResetToken;

        const user = await User.findOne({ 'email.value': userEmail });

        if (!user) {
            return res.status(404).json({
                err: null,
                msg: "No user exists with the provided email.",
                data: null
            });
        }

        if (!user.password.passwordResetToken) {
            return res.status(404).json({
                err: null,
                msg: "You didn't request to reset your password.",
                data: null
            });
        }

        if (user.password.passwordResetToken.value != passwordResetToken) {

            return res.status(404).json({
                err: null,
                msg: "Invalid token.",
                data: null
            });

        } else {

            if (moment(user.password.passwordResetToken.expires).isBefore(moment().utc())) {
                return res.status(401).json({
                    err: null,
                    msg: "You password reset token is expired, Please reset your password agian.",
                    data: null
                });
            } else {

                const hashedPassword = await hashPassword(newPassword);

                user.password = {
                    value: hashedPassword,
                    passwordResetToken: undefined
                };

                user.save();

                return res.status(200).json({
                    err: null,
                    msg: "Password updated successfully.",
                    data: null
                });
            }
        }
    },
    updateProfile: async (req, res) => {

        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });

        return res.status(200).json({
            err: null,
            msg: "Profile updated successfully!",
            data: user
        });

    },
    updatePassword: async (req, res) => {

        const oldPassword = req.body.oldPassword;
        const newPassword = await hashPassword(req.body.newPassword);

        const user = await User.findById(req.user.id);

        const isPasswordCorrect = await user.isValidPassword(oldPassword);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                err: null,
                msg: "Your old password is incorrect.",
                data: null
            });
        }

        user.password = {
            value: newPassword,
            passwordResetToken: undefined
        };

        user.save();

        return res.status(200).json({
            err: null,
            msg: "Password updated successfully!",
            data: null
        });
    },
    getProfile: async (req, res) => {

        const user = await User.findById(req.user.id)
            .populate({ path: 'myShoppingLists', select: { 'id': 1, 'items': 1, 'notes': 1, 'volunteer': 1 }, populate: { path: 'volunteer', select: { 'id': 1, 'name': 1, 'photo': 1 } } })
            .populate({ path: 'volunteeredShoppingList', select: { 'id': 1, 'items': 1, 'notes': 1, 'owner': 1 }, populate: { path: 'owner', select: { 'id': 1, 'name': 1, 'photo': 1 } } });

        delete user.password;

        return res.status(200).json({
            err: null,
            msg: "Profile retrieved successfully.",
            data: user
        });

    },
    getUser: async (req, res) => {

        const user = await User.findById(req.params.id);

        delete user.email;
        delete user.password;
        delete user.updatedAt;

        return res.status(200).json({
            err: null,
            msg: "User retrieved successfully.",
            data: user
        });

    }
}

