require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");

const app = express();

const PORT = process.env.PORT || 5000;


   //MIDDLEWARE


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


  // EJS SETUP


app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

/* =========================
   STATIC FILES
========================= */

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

/* =========================
   EJS ROUTES
========================= */

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/shop", async (req, res) => {
    try {
        const products = await Product.find();

        res.render("shop", {
            products
        });

    } catch (error) {
        console.log(error);

        res.status(500).send(
            "Unable to load products"
        );
    }
});

app.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res
                .status(404)
                .send("Product not found");
        }

        res.render("product", {
            product
        });

    } catch (error) {
        console.log(error);

        res.status(500).send(
            "Unable to load product"
        );
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/cart", (req, res) => {
    res.render("cart");
});

app.get("/wishlist", (req, res) => {
    res.render("wishlist");
});

/* =========================
   PRODUCT REST API
========================= */

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch product"
        });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const product = await Product.create(
            req.body
        );

        res.status(201).json(product);

    } catch (error) {
        console.log(error);

        res.status(400).json({
            message: error.message
        });
    }
});

app.put("/api/products/:id", async (req, res) => {
    try {
        const product =
            await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        console.log(error);

        res.status(400).json({
            message: error.message
        });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const product =
            await Product.findByIdAndDelete(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to delete product"
        });
    }
});

/* =========================
   SERVER + MONGODB
========================= */

async function startServer() {
    try {

        if (!process.env.MONGO_URI) {
            console.log(
                "ERROR: MONGO_URI is missing in .env file"
            );

            process.exit(1);
        }

        console.log("Connecting to MongoDB...");

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB Connected Successfully"
        );

        app.listen(PORT, () => {
            console.log(
                `SERIAL running at http://localhost:${PORT}`
            );
        });

    } catch (error) {

        console.log(
            "MongoDB Connection Error:"
        );

        console.log(
            error.message
        );

        process.exit(1);
    }
}

startServer();