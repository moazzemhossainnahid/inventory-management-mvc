const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// middlewares
app.use(express.json());
app.use(cors());

// Schema Design
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide a Name for this Product."],
        trim: true,
        unique: [true, "Name must be unique."],
        minlength: [3, "Name Must be at least 3 Charecters."],
        maxlength: [100, "Name is too large."],

    },
    description: {
        type: String,
        required: [true, "Please Provide a Description for this Product."],
    },
    price: {
        type: Number,
        required: [true, "Please Provide a Price for this Product."],
        min: [0, "Price Can't be Negative."],
    },
    unit: {
        type: String,
        required: [true],
        enum: {
            value: ["kg", "litre", "pcs"],
            message: "Unit value Can't be {VALUE}, must be kg/litre/pcs."
        },
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity Can't be Negative."],
        validate: {
            validator: (value) => {
                const isInteger = Number.isInteger(value);
                if (isInteger) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
})

app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});


module.exports = app;