const ShoppingList = require("../models/shoppingList");
const User = require("../models/user");

module.exports = {
    create: async (req, res) => {

        const newShoppingList = new ShoppingList({
            items: req.body.items,
            notes: req.body.notes,
            owner: req.user.id,
        });

        await newShoppingList.save();




        const user = await User.findById(req.user.id);

        user.myShoppingLists.push(newShoppingList.id);

        await user.save();

        const shoppingListPopulated = await ShoppingList.findById(newShoppingList.id).populate('owner', ['id', 'name', 'photo']);

        return res.status(200).json({
            err: null,
            msg: `Shopping list created successfully.`,
            data: {
                shoppingList: shoppingListPopulated
            }
        });
    },
    getAll: async (req, res) => {

        const options = {
            page: req.body.page,
            limit: 10,
        };

        const shoppingLists = await ShoppingList.find({}).populate('owner', ['id', 'name', 'photo']).populate('volunteer', ['id', 'name', 'photo']);

        return res.status(200).json({
            err: null,
            msg: `Shopping lists retrieved successfully.`,
            data: {
                shoppingLists: shoppingLists
            }
        });

    },
    getMyShoppingLists: async (req, res) => {

        const query = {
            owner: req.params.id
        }

        const shoppingLists = await ShoppingList.find(query)
            .populate('owner', ['id', 'name', 'photo'])
            .populate('volunteer', ['id', 'name', 'photo']);

        return res.status(200).json({
            err: null,
            msg: `Shopping lists retrieved successfully.`,
            data: {
                shoppingLists: shoppingLists
            }
        });

    },
    getMyVolunteerShoppingLists: async (req, res) => {


        const query = {
            volunteer: req.params.id
        }

        const shoppingLists = await ShoppingList.find(query)
            .populate('owner', ['id', 'name', 'photo'])
            .populate('volunteer', ['id', 'name', 'photo']);


        return res.status(200).json({
            err: null,
            msg: `Shopping lists retrieved successfully.`,
            data: {
                shoppingLists: shoppingLists
            }
        });

    },
    delete: async (req, res) => {

        await ShoppingList.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            err: null,
            msg: `Shopping list deleted successfully.`,
            data: null
        });
    },
    update: async (req, res) => {

        await ShoppingList.findByIdAndUpdate(req.params.id);

        return res.status(200).json({
            err: null,
            msg: `Shopping list updated successfully.`,
            data: null
        });
    },
    buy: async (req, res) => {

        const user = await User.findById(req.user.id);

        const shoppingList = await ShoppingList.findById(req.params.id);

        if (user.id == shoppingList.owner) {
            return res.status(401).json({
                err: null,
                msg: `Can't buy your own shopping list.`,
                data: null
            });
        }

        shoppingList.volunteer = user.id;

        user.volunteeredShoppingList.push(shoppingList.id)

        return res.status(200).json({
            err: null,
            msg: `Done.`,
            data: null
        });

    },
    unbuy: async (req, res) => {
        const user = await User.findById(req.user.id);

        const shoppingList = await ShoppingList.findById(req.params.id);

        shoppingList.volunteer = undefined;

        const index = user.volunteeredShoppingList.indexOf(shoppingList.id);

        if (index !== -1) user.volunteeredShoppingList.splice(index, 1);

        return res.status(200).json({
            err: null,
            msg: `Done.`,
            data: null
        });
    }

}