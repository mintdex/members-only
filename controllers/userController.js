const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { body, validationResult } = require("express-validator");


// Display sign in form on GET
exports.user_signin_get = (req, res, next) => {
    res.render("sign_in_form", { title: "Sign in" });
}

// Handle user sign in on POST
exports.user_signin_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
});

// Display sign up form for GET
exports.user_create_get = (req, res, next) => {
    // Only let user sign up if not sign in
    if (req.user) {
        res.redirect("/");
    }
    res.render("sign_up_form", { title: "Sign up" });
}

// Handle user create on POST
exports.user_create_post = [

    body("full_name", "Full name must be specified").trim().isLength({ min: 1 }).escape(),
    body("username").isEmail().withMessage("Need an Email of format asd@xyz").bail().escape()
        .custom(async (value) => {
            // Check if username is already exist
            const user = await User.findOne({ username: value });
            if (user !== null) {
                throw new Error("Username already exits");
            } else {
                return true;
            }
        }),
    body("password", "Password need to be at least 5 characters").isLength({ min: 5 }),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match passsword");
        } else {
            return true;
        }
    }).escape(),

    // Process request after validation    
    (req, res, next) => {

        // Extract errors after validation
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with errors messages
            res.render("sign_up_form", { title: "Sign up", errors: errors.array(), user: req.body });
        } else {
            // Data is valid
            // Hash password and create user obj to save  
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    return next(err);
                }

                // Hashed successfully
                const user = new User({
                    full_name: req.body.full_name,
                    username: req.body.username,
                    password: hashedPassword
                });
                user.save(err => {
                    if (err) {
                        return next(err);
                    }
                    // Successful - redirect to home page
                    res.redirect("/sign-in");
                });
            });
        }
    }
];

// Handle log out on GET
exports.user_logout_get = (req, res, next) => {
    req.logout();
    res.redirect("/");
}

// Display secret passcode page on GET
exports.user_update_membership_get = (req, res) => {
    res.render("secret_code_form", { title: "Join the club" });
};

// Handle join club secret code on POST
exports.user_update_membership_post = (req, res, next) => {
    const secretCode = process.env.SECRET_CODE || "member";

    if (req.body.secret_code !== secretCode) {
        // Wrong secret code, render secret code form again with error message
        res.render("secret_code_form", { title: "Join the club", error: "Wrong passcode!" })
    } else {
        // Right passcode, update membership status
        User.findByIdAndUpdate(req.user._id, { _id: req.user._id, membership_status: true }, {}, (err) => {
            if (err) { return next(err); }
            // Succesful - redirect to homepage
            res.redirect("/")
        })
    }
};

// Display admin form on GET
exports.user_become_admin_get = (req, res) => {
    res.render("admin_form", { title: "Become The One " })
};

// Handle become admin request on POST
exports.user_become_admin_post = (req, res, next) => {
    const adminPassCode = process.env.ADMIN_SECRET || "admin";

    // Check user secret code
    if (req.body.admin_secret !== adminPassCode) {
        // Wrong secret code
        res.render("admin_form", { title: "Become The One", error: "Nearly there! Wrong passcode!" })
    } else {
        // Right passcode, update user role to admin
        User.findByIdAndUpdate(req.user._id, { is_admin: true }, {}, (err, oldUser) => {
            if (err) { return next(err); }

            // successful-redirect to homepage
            res.redirect("/");
        })
    }
}

