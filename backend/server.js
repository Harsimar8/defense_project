const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = './data/assets.json';

// Helper function to safely read the structured JSON object
const readDatabase = () => {
  try {
    // Automatically create directory/file structures if they don't exist yet
    const dir = path.dirname(FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify({ assets: [], logs: [] }, null, 2));
    }

    const data = fs.readFileSync(FILE_PATH, 'utf8');
    if (!data.trim()) {
      return { assets: [], logs: [] };
    }

    const parsed = JSON.parse(data);
    // Safety fallback properties to prevent runtime engine method exceptions
    if (!parsed.assets) parsed.assets = [];
    if (!parsed.logs) parsed.logs = [];
    return parsed;
  } catch (error) {
    console.error("[Database Read Warning]: Resetting schema template.", error.message);
    return { assets: [], logs: [] };
  }
};

// Helper function to save changes cleanly
const writeDatabase = (dataObject) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(dataObject, null, 2));
};

// 1. GET all data (Sends both assets array & logs array to your Angular app)
app.get('/assets', (req, res) => {
  const db = readDatabase();
  res.json(db);
});

// 2. ADD asset + Auto Audit Logging
app.post('/assets', (req, res) => {
  const db = readDatabase();

  const newAsset = {
    id: Date.now(),
    ...req.body
  };

  // ✅ Correctly push into the nested .assets array
  db.assets.push(newAsset);

  // ✅ Auto-append interactive logs for your frontend audit trail component
  db.logs.unshift({
    id: Date.now() + 1,
    timestamp: new Date().toLocaleTimeString(),
    action: 'DEPLOYMENT',
    message: `New asset "${newAsset.name}" (${newAsset.type}) stationed at ${newAsset.location || 'Unknown location'}.`
  });

  writeDatabase(db);
  console.log(`[Backend] Deployed: ${newAsset.name}`);
  res.json({ message: 'Asset added successfully', asset: newAsset });
});

// 3. UPDATE asset status (PUT) + Auto Audit Logging
app.put('/assets/:id', (req, res) => {
  const db = readDatabase();
  const targetId = req.params.id;
  const assetIndex = db.assets.findIndex(a => String(a.id) === String(targetId));

  if (assetIndex !== -1) {
    const oldStatus = db.assets[assetIndex].status;
    
    db.assets[assetIndex] = {
      ...db.assets[assetIndex],
      ...req.body
    };
    
    const newStatus = db.assets[assetIndex].status;

    // Log tracking adjustments
    db.logs.unshift({
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      action: 'STATUS_SHIFT',
      message: `System "${db.assets[assetIndex].name}" adjusted status parameters from [${oldStatus}] to [${newStatus}].`
    });

    writeDatabase(db);
    console.log(`[Backend] Updated Status: ${db.assets[assetIndex].name}`);
    res.json({ message: 'Asset updated successfully', asset: db.assets[assetIndex] });
  } else {
    res.status(404).json({ message: 'Asset not found' });
  }
});

// 4. DELETE asset (DELETE) + Auto Audit Logging
app.delete('/assets/:id', (req, res) => {
  const db = readDatabase();
  const targetId = req.params.id;
  
  const targetAsset = db.assets.find(a => String(a.id) === String(targetId));

  if (targetAsset) {
    // Filter item out of nested array
    db.assets = db.assets.filter(a => String(a.id) !== String(targetId));

    // Log the deletion activity
    db.logs.unshift({
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      action: 'DECOMMISSION',
      message: `CRITICAL: Asset "${targetAsset.name}" has been decommissioned and removed from system database.`
    });

    writeDatabase(db);
    console.log(`[Backend] Purged Asset ID: ${targetId}`);
    res.json({ message: 'Asset deleted successfully' });
  } else {
    res.status(404).json({ message: 'Asset not found' });
  }
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});