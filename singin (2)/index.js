const express = require('express');
const cors = require('cors');
const encodePassword = require('./hash').encodePassword;
const generateToken = require('./hash').generateToken;
const app = express();

app.use(cors());
app.use(express.json());

let nextId = 2; // для додавання апгрейдів

let users = [];

let upgrades = [{
  id: 1,
  name: "Click Accelerator",
  description: "speed of earning x10",
  price: 40000,
  type: "multiplyClick",
  value: 10
}];

function getUserById(id) {
  return users.find(user => user.id === id);
}

// Click
app.post('/click', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'Missing id' });

  const user = getUserById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.balance += user.coinsPerClick;
  res.status(200).json({ balance: user.balance });
});

// Passive income
app.post('/passive-income', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'Missing Id' });

  const user = getUserById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.balance += user.passiveIncomePerSecond;
  return res.status(200).json({ balance: user.balance });
});

// Buy upgrade
app.post('/buy-upgrade', (req, res) => {
  const { upgradeId, userId } = req.body;

  const upgrade = upgrades.find(u => u.id === upgradeId);
  const user = getUserById(userId);

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!upgrade) return res.status(404).json({ message: 'Upgrade not found' });
  if (user.balance < upgrade.price) return res.status(400).json({ message: 'Not enough coins' });

  user.balance -= upgrade.price;

  switch (upgrade.type) {
    case "multiplyClick":
      user.coinsPerClick *= upgrade.value;
      break;
    case "addClick":
      user.coinsPerClick += upgrade.value;
      break;
    case "multiplyPassive":
      user.passiveIncomePerSecond *= upgrade.value;
      break;
    case "addPassive":
      user.passiveIncomePerSecond += upgrade.value;
      break;
    default:
      return res.status(409).json({ message: 'Unsupported effect type' });
  }

  res.status(200).json({
    balance: user.balance,
    coinsPerClick: user.coinsPerClick,
    passiveIncomePerSecond: user.passiveIncomePerSecond
  });
});

// Sign-up
app.post('/sign-up', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required!' });
  if (password.length < 8) return res.status(400).json({ message: 'Password too short' });
  if (users.find((user) => user.email === email)) return res.status(400).json({ message: 'User already exists!' });

  const hashedPassword = encodePassword(password);
  const id = generateToken(email); // використовується як ID

  users.push({
    id,
    email,
    password: hashedPassword,
    balance: 0,
    coinsPerClick: 1,
    passiveIncomePerSecond: 0
  });

  res.status(201).json({ message: 'Registration successful!', userId: id });
});

// Sign-in
app.post('/sign-in', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required!' });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.password !== encodePassword(password)) return res.status(401).json({ message: 'Incorrect password' });

  res.status(200).json({ userId: user.id });
});

// GET all upgrades
app.get('/upgrades', (req, res) => {
  res.json(upgrades);
});

// GET upgrade by ID
app.get('/upgrades/:id', (req, res) => {
  const upgrade = upgrades.find(u => u.id === parseInt(req.params.id));
  if (!upgrade) return res.status(404).json({ error: "Upgrade not found" });
  res.json(upgrade);
});

// ADD new upgrade
app.post('/upgrades', (req, res) => {
  const upgrade = { id: nextId++, ...req.body };
  upgrades.push(upgrade);
  res.status(201).json(upgrade);
});

// UPDATE upgrade
app.put('/upgrades/:id', (req, res) => {
  const upgrade = upgrades.find(u => u.id === parseInt(req.params.id));
  if (!upgrade) return res.status(404).json({ error: "Upgrade not found" });

  Object.assign(upgrade, req.body);
  res.json(upgrade);
});

// DELETE upgrade
app.delete('/upgrades/:id', (req, res) => {
  const upgradeIndex = upgrades.findIndex(u => u.id === parseInt(req.params.id));
  if (upgradeIndex === -1) return res.status(404).json({ error: "Upgrade not found" });

  upgrades.splice(upgradeIndex, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
