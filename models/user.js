const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    email: {
        isVerified: {
            type: Boolean,
            required: true
        },
        emailVerificationToken: {
            type: String
        },
        value: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        }
    },
    password: {
        passwordResetToken: {
            value: String,
            expires: Date
        },
        value: {
            type: String,
            required: true,
        }
    },
    birthdate: {
        type: Date,
        required: true
    },
    phoneNumber: {
        isVerified: {
            type: Boolean
        },
        phoneNumberVerificationToken: {
            type: String
        },
        value: {
            type: Number,
        }
    },
    address: {
        floor: {
            type: Number,
        },
        apartmentNumber: {
            type: Number,
        },
        buildingNumber: {
            type: Number,
        },
        streetName: {
            type: String,
        },
        district: {
            type: String,
        },
        city: {
            type: String,
        },
        country: {
            type: String,
        }
    },
    photo: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    shoppingLists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShoppingList'
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

userSchema.plugin(mongoosePaginate);

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password.value);
    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;