const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const shoppingListSchema = mongoose.Schema({
    items: [{
        itemName: {
            type: String
        },
        quantity: {
            type: Number
        }
    }],
    notes: {
        type: String
    },
    owner:
    {
        type: String,
        ref: 'User'
    },
    volunteer:
    {
        type: String,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

shoppingListSchema.plugin(mongoosePaginate);

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = ShoppingList;