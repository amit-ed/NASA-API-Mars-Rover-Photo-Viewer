var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var formHandlerRouter = require('./routes/formHandler');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var passwordRouter = require('./routes/password');
var mainRouter = require('./routes/main');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:"somesecretkey",
    resave: false, // Force save of session for each request
    saveUninitialized: true, // Save a session that is new, but has not been modified
}));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/formHandler', formHandlerRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/password', passwordRouter);
app.use('/main', mainRouter);
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
