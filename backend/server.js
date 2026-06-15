const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = './data/assets.json';

// Helper function to read data safely
const readData = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write data safely
const writeData = (dataArray) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(dataArray, null, 2));
};

// 1. GET all assets
app.get('/assets', (req, res) => {
  const assets = readData();
  res.json(assets);
});

// 2. ADD asset
app.post('/assets', (req, res) => {
  const assets = readData();
  const newAsset = {
    id: Date.now(),
    ...req.body
  };
  assets.push(newAsset);
  writeData(assets);
  res.json({ message: 'Asset added', asset: newAsset });
});

// 3. UPDATE asset status (PUT)
app.put('/assets/:id', (req, res) => {
  const assets = readData();
  const targetId = req.params.id;
  const assetIndex = assets.findIndex(a => String(a.id) === String(targetId));

  if (assetIndex !== -1) {
    assets[assetIndex] = {
      ...assets[assetIndex],
      ...req.body
    };
    writeData(assets);
    res.json({ message: 'Asset updated successfully', asset: assets[assetIndex] });
  } else {
    res.status(404).json({ message: 'Asset not found' });
  }
});

// 4. DELETE asset (DELETE)
app.delete('/assets/:id', (req, res) => {
  const assets = readData();
  const targetId = req.params.id;
  const initialLength = assets.length;
  
  const filteredAssets = assets.filter(a => String(a.id) !== String(targetId));

  if (filteredAssets.length < initialLength) {
    writeData(filteredAssets);
    res.json({ message: 'Asset deleted successfully' });
  } else {
    res.status(404).json({ message: 'Asset not found' });
  }
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});