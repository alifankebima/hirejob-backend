const jwt = require("jsonwebtoken");
const commonHelper = require("../helper/common");

//Require bearer token (user is logged in) before accessing next route
const protect = (req, res, next) => {
    (req.headers.authorization)
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
            commonHelper.response(res, null, 401, "Token expired");
        } else {
            commonHelper.response(res, null, 401, "Token not active");
        }
    }
};

//Ensures id_worker or id_recruiter in payload (login auth token)
//Is the same compared to id_worker or id_recruiter in params
//This prevents user modifying data created by other user
//Usually applied on put or delete request
const isIdValid = (req, res, next) => {
    const payload = req.payload;
    const queryId = req.params.id_recruiter || req.params.id_worker;

    if (payload) {
        if (payload.id == queryId) {
            next();
        } else {
            commonHelper.response(res, null, 403,
                "Modifying data created by other user is not allowed");
        }
    } else {
        commonHelper.response(res, null, 403, "User not found");
    }
};

//Checks if role in payload (login auth token) is recruiter
const isRecruiter = (req, res, next) => {
    const payload = req.payload;
    if (payload) {
        if (payload.role === "recruiter") {
            next();
        } else {
            commonHelper.response(res, null, 403,
                "Unauthorized, please login as recruiter");
        }
    } else {
        commonHelper.response(res, null, 403, "User not found");
    }
};

//Checks if role in payload (login auth token) is worker
const isWorker = (req, res, next) => {
    const payload = req.payload;
    if (payload) {
        if (payload.role === "worker") {
            next();
        } else {
            commonHelper.response(res, null, 403,
                "Unauthorized, please login as worker");
        }
    } else {
        commonHelper.response(res, null, 403, "User not found");
    }
};

module.exports = { protect, isIdValid, isRecruiter, isWorker };
