const express = require("express");
const router = express.Router();
const axios = require('axios');

// Routes
router.get("/login", (req, res) => {
    res.render("login");
});

router.post('/login', async (req, res) => {
    try {
        console.log("Logging In")
        const response = await axios.post('http://localhost:3000/ums/auth/login', req.body);
        const token = response.data.token;
        req.session.jwt = token; // Store the token in the session
        res.redirect('/dashboard'); // Redirect to the dashboard
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
            const errorMessage = error.response.data.message;
            res.render('login', { error_msg: errorMessage });
        } else {
            res.status(500).send('An error occurred while logging in');
        }
    }
});

router.get("/register", async (req, res) => {
    res.render("register");
});



router.post('/register', async (req, res) => {
    try {
        console.log("Registering User")
        let response = await axios.post('http://localhost:3000/ums/auth/register', req.body)
        console.log(response);
        if (response.status === 201) {
            res.render('login', { success_msg: "User registered successfully, Please login to continue." });
        } else {
            res.render('register', { error_msg: "An error occurred during registration, please try again later." });
        }
    } catch (error) {
        console.log(error);
        if (error.response) {
            if (error.response.status === 409) {
                res.render('register', { error_msg: "This email has already been registered." });
            } else if (error.response.status === 401) {
                const errorMessage = error.message;
                res.render('register', { error_msg: errorMessage });
            } else {
                res.status(500).send('An error occurred during registration, please try again later: ' + error.message);
            }
        } else {
            res.status(500).send('An error occurred during registration, please try again later: ' + error.message);
        }
    }
});


router.get('/logout', (req, res) => {
    req.flash('success_msg', 'You are logged out.');
    req.session.destroy(); // Destroy the session
    res.redirect('/user/login');
});

module.exports = router;