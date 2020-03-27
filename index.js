const express = require('express');
const bodyParser = require('body-parser');
const userRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/', (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  res.send('Account created!!!');
});

app.listen(3000, () => {
  console.log('Listening from port 3000');
});
