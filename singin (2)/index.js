const express = require('express');
const cors = require('cors');
const encodePassword = require('./hash').encodePassword;
const generateToken = require('./hash').generateToken;
const app = express();

let users = [];



app.use(cors());
app.use(express.json());

app.post('/sign-up', (req, res) => {
  const { email, password } = req.body;

  if (!email ||!password) {
    res.status(400).json({ message: 'Email and password are required!' });
    return;
  }

  if (password.length < 8) {
    res
      .status(400)
      .json({ message: 'Password length should be minimum 8 symbols!' });
    return;
  }

  if (users.find((user) => user.email === email)) {
    res.status(400).json({ message: 'User with this email already exists!' });
    return;
  }

  const hashedPassword = encodePassword(password);
  
  users.push({email, password: hashedPassword });
  

  res.status(201).json({ message: 'Реєстрація успішна!' });
});

app.post('/sign-in', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ message: 'Email and password are required!' });
    return;
  }


  if (users.find((user) => user.email === email)) {
    res.status(400).json({ message: 'Email is not correct' });
    return;
  }

  if(users.find((user) => user.password === password)) {
    res.status(400).json({ message: ' Password is not correct'});
    return;
  }

  res.status(200).json({ "token": generateToken(email) });
});

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});
