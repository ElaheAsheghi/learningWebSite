const express = require('express');
const authRouter = require('./routes/v1/auth');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(
    '/courses/covers',
    express.static(path.join(__dirname, "public", "courses", "covers"))
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); //for uploading files
app.use(bodyParser.json()); //for bodies with json type

app.use("/v1/auth", authRouter);

module.exports = app;