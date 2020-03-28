const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const userRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['12myszka34']
  })
);

app.get('/', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="passowrd confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post('/', async (req, res) => {
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
});

app.listen(3000, () => {
  console.log('Listening from port 3000');
});
