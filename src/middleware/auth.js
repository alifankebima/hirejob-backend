const jwt = require("jsonwebtoken");
const commonHelper = require("../helper/common");

const protect = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
            let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
            req.payload = decoded;
            next();
        } else {
            commonHelper.response(
                res,
                null,
                401,
                "Unauthorized, server needed a token"
            );
        }
    } catch (error) {
        if (error && error.name === "JsonWebTokenError") {
            commonHelper.response(res, null, 401, "Token invalid");
        } else if (error && error.name === "TokenExpiredError") {
            commonHelper.response(res, null, 403, "Token expired");
        } else {
            commonHelper.response(res, null, 401, "Token not active");
        }
    }
};

const isIdValid = (req, res, next) => {
    const payload = req.payload;
    const queryId = req.params.id;
    if (payload) {
        if (payload.id == queryId) {
            next();
        } else {
            commonHelper.response(
                res,
                null,
                403,
                "Unauthorized, please login with a different account"
            );
        }
    } else {
        commonHelper.response(res, null, 403, "User not found");
    }
};

module.exports = { protect, isIdValid };
