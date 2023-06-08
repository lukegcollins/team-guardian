const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const flash = require('connect-flash');
const methodOverride = require('method-override');
const axios = require('axios');
const cors = require('cors');
const databaseConfig = require('./config/database');
const authRoutes = require('./routes/userAuth');
const dashboardRoute = require('./routes/dashboard');

const app = express();

// Middleware
app.use(methodOverride('_method'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }, { useUnifiedTopology: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

app.use(session(databaseConfig.sessionConfig))
app.use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/user', authRoutes)
app.use('/dashboard', dashboardRoute)

// Home Page
app.get("/", (req, res) => {
    res.render('landing');
});

// Start Server
app.listen(1000, () => {
    console.log('Frontend service is running on http://localhost:1000');
});
