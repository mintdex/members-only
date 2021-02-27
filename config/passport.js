const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = (passport) => {
    // Passport config
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(
        (username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) { return done(err) }

                // Validate username
                if (!user) {
                    return done(null, false, { message: "Incorrect username!" });
                }
                
                // Validate password
                bcrypt.compare(password, user.password, (err, isCorrect) => {
                    if (err) { return done(err); }

                    if (!isCorrect) {
                        return done(null, false, { message: "Wrong password!" });
                    }
                    // Correct password
                    return done(null, user);
                })
            })
        }
    ));
}
