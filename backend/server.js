const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// GET all assets
app.get('/assets', (req, res) => {
  const data = fs.readFileSync('./data/assets.json', 'utf8');
  res.json(JSON.parse(data));
});

// ADD asset
app.post('/assets', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./data/assets.json', 'utf8'));

  const newAsset = {
    id: Date.now(),
    ...req.body
  };

  data.push(newAsset);

  fs.writeFileSync('./data/assets.json', JSON.stringify(data, null, 2));

  res.json({ message: 'Asset added' });
});

app.post('/assets', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./data/assets.json', 'utf8'));

  const newAsset = {
    id: Date.now(),
    ...req.body
  };

  data.push(newAsset);

  fs.writeFileSync('./data/assets.json', JSON.stringify(data, null, 2));

  res.json({ message: 'Asset added' });
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});