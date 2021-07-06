//const connection = require(".src/model");
const express = require("express");
const application = express();
const path = require("path");
//const expressHandleBars = require("express-handlebars");
const bodyParser = require("body-parser");

const Branch = require("./controller/branch");
application.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
application.use(bodyParser.json());

application.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

application.use("/beetlenut", Branch);

const port = process.env.PORT || 3000;
application.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
