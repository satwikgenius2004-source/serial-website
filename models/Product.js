const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        badge: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
        },

        sizes: {
            type: [String],
            default: ["S", "M", "L", "XL"]
        },

        colors: {
            type: [String],
            default: []
        },

        stock: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);