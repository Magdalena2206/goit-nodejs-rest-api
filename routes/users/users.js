const express = require("express");
const router = express.Router();
const { signup, login, logout, current } = require("../../controllers/users");
const guard = require("../../helpers/guard");
const loginLimit = require("../../helpers/rate-limit_login");

router.post("/signup", signup);
router.post("/login", loginLimit, login);
router.post("/logout", guard, logout);
router.get("/current", guard, current)
module.exports = router;
