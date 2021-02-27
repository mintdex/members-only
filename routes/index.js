var express = require('express');
var router = express.Router();
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get('/', message_controller.message_list);

// GET request for creating new user
router.get("/sign-up", user_controller.user_create_get);

// POST request for creating new user
router.post("/sign-up", user_controller.user_create_post);


// GET request to log in
router.get("/sign-in", user_controller.user_signin_get);

// POST request to log in
router.post("/sign-in", user_controller.user_signin_post);

// GET request to log out
router.get("/log-out", user_controller.user_logout_get);

// GET request to join secret club
router.get("/membership", isLoggedIn, user_controller.user_update_membership_get);

// POST request to join secret club
router.post("/membership", isLoggedIn, user_controller.user_update_membership_post);

// GET request to become admin
router.get("/admin", isLoggedIn, user_controller.user_become_admin_get);

// POST request to become admin
router.post("/admin", isLoggedIn, user_controller.user_become_admin_post);

function isLoggedIn(req, res, next) {
    // check if user is logged in
    if (req.user) {
        next()
    } else {
        res.redirect("/sign-in")
    }
}
module.exports = router;
