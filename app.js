var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport");



require("dotenv").config();

var indexRouter = require('./routes/index');
const messageRouter = require("./routes/message");

var app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
const dev_db_url = process.env.DEV_MONGODB_URL || "mongodb+srv://mintdex:tuanlk55@cluster0.nq04o.mongodb.net/memberOnlyDatabase?retryWrites=true&w=majority";
const mongoDb = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connect error:"))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next()
});



// Routes
app.use('/', indexRouter);
app.use("/message",
    // Only let logged in user to access this route
    (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect("/sign-in");
        }

    },
    messageRouter
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
