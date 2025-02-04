require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("../server/router/index.js");
const errorMiddleware = require("./middlewares/error-middleware");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: [process.env.CLIENT_URL, "http://localhost:3001"],
    })
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose
            .connect(process.env.DB_URL)
            .then(() => console.log("Connected to MongoDB"))
            .catch((err) =>
                console.error("Could not connect to MongoDB...", err)
            );
        app.listen(PORT, () => {
            console.log(`server starts on ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
