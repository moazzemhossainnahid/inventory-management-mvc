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

// productSchema.post('save', function (doc, next) {
//     console.log("After Saving Data");

//     next();
// });

productSchema.methods.logger = function () {
    console.log(`Data Saved for ${this.name}`);
}

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

        result.logger();


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


// get product
app.get("/api/v1/product", async (req, res, next) => {
    try {
        // Operators
        // =============================================================================================
        // =============================================================================================
        const products = await Product.find({});

        // ==========================
        // Get by ID
        // ==========================
        // const products = await Product.find({ _id: "636a67aa073826aede164c52" });

        // ==========================
        // Or operator
        // ==========================
        // const products = await Product.find({$or: [{ _id: "636a67aa073826aede164c52" }, {name: "Rice"}]});

        // ==========================
        // Not Equal
        // ==========================
        // const products = await Product.find({ status: { $ne: "out-of-stock" } });

        // ==========================
        // Greter than Equal
        // ==========================
        // const products = await Product.find({ quantity: { $gte: 100 } });

        // ==========================
        // in Operator
        // ==========================
        // const products = await Product.find({ name: { $in: ["Rice", "Soyabin Oil"] } });

        // =============================================================================================
        // =============================================================================================

        // Projection
        // const products = await Product.find({}, "name quantity price");
        // const products = await Product.find({}, "-name -quantity");

        // sorting
        // const products = await Product.find({}).sort({ quantity: 1 });
        // const products = await Product.find({}).sort({ quantity: -1 });

        // selete
        // const products = await Product.find({}).select({ name: 1 });

        // chaining
        /*         const products = await (await Product
                    .where("name").equals(/\w/)
                    .where("quantity").gt(100).lt(600)
                    .limit(2).sort({quantity: -1})); */

        // find by id
        // const product = await Product.findById("636a5f04929eb7c6250c49b8");

        // others
/*         const product = await Product.findById(undefined);
        const product = await Product.findById(_undefined); */



        res.status(200).json({
            status: "success",
            message: "Data Get Successfull",
            data: products
        });

    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "Can't Get Data",
            error: error.message
        });
    };
});


module.exports = app;