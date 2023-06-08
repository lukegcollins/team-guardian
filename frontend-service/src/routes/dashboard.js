const express = require("express");
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const session = req.session;
    const token = session.jwt; // Retrieve the JWT from the session object
    if (!token) {
      res.render('login', { error_msg: "Unauthorized, Please login to continue." });
    }

    const umsResponse = await axios.get('http://localhost:3000/ums/profile/current', {
      headers: {
        Authorization: `Bearer ${token}` // Include the JWT in the request header
      }
    });

    console.log(umsResponse);

    console.log("Rendering");
    res.render('dashboard', { user: umsResponse.data.user });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while fetching the user profile');
  }
});

router.post('/profile/current', async (req, res) => {
  try {
    const session = req.session;
    const token = session.jwt;
    if (!token) {
      res.render('login', { error_msg: "Unauthorized, Please login to continue." });
      return;
    }

    const { firstName, lastName, email, password } = req.body;

    const umsResponse = await axios.put('http://localhost:3000/ums/profile/current', {
      firstName,
      lastName,
      email,
      password
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    req.session.jwt = umsResponse.data.token;

    console.log(umsResponse)
    if (umsResponse.status === 200) {
      res.render('dashboard', {
        success_msg: "User profile updated successfully",
        user: umsResponse.data.currentUser
      });
    } else {
      res.render('dashboard', {
        error_msg: "An error occurred while updating the profile, please try again later.",
        user: umsResponse.data.currentUser
      });
    }
  } catch (error) {
    console.log(error);
    if (error.umsResponse) {
      if (error.umsResponse.status === 404) {
        res.render('dashboard', { error_msg: "We are unable to find the user profile at this time." });
      } else if (error.umsResponse.status === 409) {
        res.render('dashboard', { error_msg: "This email is already registered." });
      } else if (error.umsResponse.status === 401) {
        res.render('dashboard', { error_msg: "The password provided is incorrect." });
      } else {
        res.render('dashboard', { error_msg: "An error occurred while updating the profile, please try again later: " + error.message });
      }
    } else {
      res.render('dashboard', { error_msg: "An error occurred while updating the profile, please try again later: " + error.message });
    }
  }
});





module.exports = router;
