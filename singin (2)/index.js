const express = require('express');
const cors = require('cors');
const encodePassword = require('./hash').encodePassword;
const generateToken = require('./hash').generateToken;
const app = express();

let users = [];

let upgrades = [{
  "id": 1,
  "name": "Click Accelerator",
  "description": "speed of earning x10",
  "price": 40000
}];

fuction getUserById(id) {
 return users.find(user => user.id === id);
}

//Click
app.post('/click' (req, res) => {
  const {userId } = req.body;
  if(!userId)return res.status(400).json({message: 'Missing id' });

  const user = getUserById(userId);
  if(!user) return  res.status(404).json({ message 'User not found'});

  user.balance += user.coinsPerClick;
  res.status(200).json({ balance: user.balance });

//Passive
app.post('/passive-income' (req, res) => {
   const { userId } = req.body;
   if(!userId) return re.status(400).json({ message: Missing Id' });

   const user = getUserById(userId);
   if(!user) return res.status(404).json({ message 'User not found' });

   user.balance += user.PassiveInCome;
   return res.status(200).json({ balance: user.balance });
});


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

  if(users.find((user) => user.password ===  encodePassword(password))) {
    res.status(400).json({ message: ' Password is not correct'});
    return;
  }

  res.status(200).json({ "userId": generateToken(email) });
});


  upgrade.name = name;
  upgrade.description = description;
  upgrade.price = price;

  res.json(upgrade);
});

// ADD NEW UPGRADE
app.post('/upgrades', (req, res) => {
  const upgrade = { id: nextId++, ...req.body };
  upgrades.push(upgrade);
  res.status(201).json(upgrade);
});

// – Отримати всі апгрейди
app.get('/upgrades', (req, res) => {
  res.json(upgrades);
});

// –Отримати апгрейд за ID
app.get('/upgrades/:id', (req, res) => {
  const upgrade = upgrades.find(u => u.id === parseInt(req.params.id));
  if (!upgrade) {
    return res.status(404).json({ error: "Upgrade не знайдено" });
  }
  res.json(upgrade);
});

// UPDATE
app.put('/upgrades/:id', (req, res) => {
  const upgrade = upgrades.find(u => u.id === parseInt(req.params.id));
  if (!upgrade) {
    return res.status(404).json({ error: "Upgrade не знайдено" });
  }

  Object.assign(upgrade, req.body);
  res.json(upgrade);
});

app.delete('/upgrades/:id', (req, res) => {
  const upgradeIndex = upgrades.findIndex(u => u.id === parseInt(req.params.id));

  if (upgradeIndex === -1) {
    return res.status(404).json({ error: "Upgrade не знайдено" });
  }

  upgrades.splice(upgradeIndex, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});



