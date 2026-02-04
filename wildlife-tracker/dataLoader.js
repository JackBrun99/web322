const fs = require('fs').promises;
const path = require('path');

async function loadSightings() {
    try {
        const filePath = path.join(__dirname, '../data/sightings.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData.sightings;
    } catch (error) {
        console.error('Error loading sightings data:', error);
        throw new Error('Failed to load sightings data');
    }
}

module.exports = { loadSightings };