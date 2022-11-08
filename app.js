const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// middlewares
app.use(express.json());
app.use(cors());

// =================================================================

// SHEMA => MODEL => QUERY

// =================================================================


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
            values: ["kg", "litre", "pcs"],
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
            },
            message: "Quantity must be an Integer."
        }
    },
    status: {
        type: String,
        enum: {
            values: ["in-stock", "out-of-stock", "discontinued"],
            message: "Status Can't be {VALUE}, must be in-stock/out-of-stock/discontinued."
        },
        required: true

    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // supplier: {
    //     type: mongoose.Schema.Types.OnjectId,
    //     ref: "Supplier"
    // },
    // categories: [{
    //     name: {
    //         type: String,
    //         required: true
    //     },
    //     _id: {
    //         type: mongoose.Schema.Types.OnjectId,
    //     }
    // }],




}, { timestamps: true });

// =================================================================

// Mongoose Middlewares for saving data: pre / post

productSchema.pre('save', function (next) {
    // this =>
    console.log("Before Saving Data");
    if (this.quantity === 0) {
        this.status = "out-of-stock"
    };

    next();
});

productSchema.post('save', function (doc, next) {
    console.log("After Saving Data");

    next();
});

// =================================================================

// Add Model

const Product = mongoose.model("Product", productSchema);


app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});

// posting to database
app.post('/api/v1/product', async (req, res, next) => {
    try {
        // save or create


        /*         // save
                const product = new Product(req.body);
        
                // Instance Creation => Do Something => Save()
        
                if (product.quantity === 0) {
                    product.status = "out-of-stock"
                }
                const result = await product.save(); */

        // create
        const result = await Product.create(req.body);


        res.status(200).json({
            status: "success",
            message: "Data Inserted Successfull.",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "Data isn't Inserted",
            error: error.message
        })
    };
});


module.exports = app;