const Message = require("../models/message");
const { body, validationResult } = require("express-validator");


exports.message_list = (req, res, next) => {
    Message.find()
        .populate("user")
        .exec((err, list_messages) => {
            if (err) {return next(err);}
            console.log(req.user);
            res.render("index", {messages: list_messages});
        })  
};

// Display message create form on GET
exports.message_create_get = (req, res, next) => {
    res.render("message_form", { title: "Create a new Message" });
};

// Handle message create on POST
exports.message_create_post = [
    // Validate data
    body("title", "Title need to be specified").trim().isLength({min:1}).escape(),
    body("text", "Must have some content").trim().isLength({min:1}).escape(),

    // Process request with escaped and trimmed data
    (req, res, next) => {

        // Extract errors after validation
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("message_form", {title: "Create a new Message", message: req.body, errors: errors.array()});
        } else {
            // Data is valid
            // Create message object and save to DB
            const message = new Message({
                title: req.body.title,
                text: req.body.text,
                user: req.user._id
            });
            message.save((err) => {
                if (err) {return next(err);}
                // successful-redirect to homepage
                res.redirect("/");
            })

        }
    }
];

// Delete a message on POST
exports.message_delete_post = (req, res, next) => {
    Message.findByIdAndDelete(req.body.message_id, {}, (err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/");
    })
}
