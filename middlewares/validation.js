const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
    validateBody: (validationSchema) => {
        return (req, res, next) => {
            const result = validationSchema.validate(req.body);
            if (result.error) {
                return res.status(400).json({
                    err: result.error,
                    msg: "Validation error.",
                    data: null
                });
            }
            next();
        }
    },
    userSchemas: {
        signUp: Joi.object().keys({
            name: Joi.object().keys({
                firstName: Joi.string().required(),
                lastName: Joi.string().required()
            }).required(),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().required().min(8),
            birthdate: Joi.date().required(),
            gender: Joi.string().required()
        }),
        verifyEmail: Joi.object().keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            emailVerificationToken: Joi.string().required().length(6)
        }),
        signIn: Joi.object().keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().required().min(8)
        }),
        updateProfile: Joi.object().keys({
            name: Joi.object().keys({
                firstName: Joi.string().required(),
                lastName: Joi.string().required()
            }),
            birthdate: Joi.date(),
            address: Joi.object().keys({
                floor: Joi.number(),
                apartmentNumber: Joi.number(),
                buildingNumber: Joi.number(),
                streetName: Joi.string(),
                district: Joi.string(),
                city: Joi.string(),
                country: Joi.string(),
            }),
            gender: Joi.string()
        }),
        updatePhoneNumber: Joi.object().keys({
            phoneNumber: Joi.number().required()
        }),
        verifyPhoneNumber: Joi.object().keys({
            phoneNumberVerificationToken: Joi.string().required().length(6)
        }),
        forgetPassword: Joi.object().keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required()
        }),
        resetPassword: Joi.object().keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().required().min(8),
            passwordResetToken: Joi.string().required().length(6)
        }),
        updatePassword: Joi.object().keys({
            oldPassword: Joi.string().required().min(8),
            newPassword: Joi.string().required().min(8)
        })
    },
    shoppingListSchemas: {
        create: Joi.object().keys({
            items: Joi.array().items({
                itemName: Joi.string(),
                quantity: Joi.number(),
            }),
            notes: Joi.string(),
            owner: Joi.objectId(),
            volunteer: Joi.objectId()
        }),
        update: Joi.object().keys({
            items: Joi.array().items({
                itemName: Joi.string(),
                quantity: Joi.number(),
            }),
            notes: Joi.string(),
            owner: Joi.objectId(),
            volunteer: Joi.objectId()
        })
    }
}