const express = require('express');
const { check } = require('express-validator');

const userRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [check('email'), check('password'), check('passwordConfirmation')],
  async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await userRepo.getOneBy({ email });
    if (existingUser) {
      return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
      return res.send('Password must match');
    }

    // Create a user in our user repo
    const user = await userRepo.create({ email, password });

    // Store the id of that user inside the users cookie
    req.session.userId = user.id;

    res.send('Account created!!!');
  }
);

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are login out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepo.getOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }

  const validPassword = await userRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send('Invalid password');
  }

  req.session.userId = user.id;

  res.send('You are signed in!!');
});

module.exports = router;
