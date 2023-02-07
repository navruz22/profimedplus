const express = require("express")
const app = express()

const { start } = require('./connectDB/db')
start(app)

const { routers } = require('./routers/routers')
const path = require('path')
routers(app)

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "./frontend", "build")));

    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "./frontend", "build", "index.html")
        );
    });
}
