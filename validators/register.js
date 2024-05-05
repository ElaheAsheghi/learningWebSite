const validator = require("fastest-validator");

const validation = new validator();

const schema = {
    name: { type: "string", min: 3, max: 255 },
    username: { type: "string", min: 3, max: 100 },
    email: { type: "email", min: 10, max: 100 },
    phone: { type: "number", max: 11 },
    password: { type: "string", min: 3, max: 24 },
    confirmPassword: { type: "equal", field: "password" },
    $$strict: true,
};

const check = validation.compile(schema);

module.exports = check;