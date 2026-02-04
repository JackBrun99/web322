/********************************************************************************
 * WEB322 - Assignment 01
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Jacques Lebrun Fleuristin Student ID: 102974243 Date: February 3, 2025
 *
 ********************************************************************************/

const express = require('express');
const path = require('path');
const { loadSightings } = require('./utils/dataLoader');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Root route - serve about page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API Endpoints

// GET /api/sightings - Return ALL sighting records
app.get('/api/sightings', async (req, res) => {
    try {
        const sightings = await loadSightings();
        res.json(sightings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/sightings/verified - Return only VERIFIED sightings
app.get('/api/sightings/verified', async (req, res) => {
    try {
        const sightings = await loadSightings();
        const verifiedSightings = sightings.filter(sighting => sighting.verified === true);
        res.json(verifiedSightings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/sightings/species-list - Return unique species names
app.get('/api/sightings/species-list', async (req, res) => {
    try {
        const sightings = await loadSightings();
        const speciesList = sightings.map(sighting => sighting.species);
        const uniqueSpecies = [...new Set(speciesList)];
        res.json(uniqueSpecies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/sightings/habitat/forest - Return forest habitat sightings
app.get('/api/sightings/habitat/forest', async (req, res) => {
    try {
        const sightings = await loadSightings();
        const forestSightings = sightings.filter(sighting => 
            sighting.habitat.toLowerCase() === "forest"
        );
        
        res.json({
            habitat: "forest",
            sightings: forestSightings,
            count: forestSightings.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/sightings/search/eagle - Search for eagle sightings
app.get('/api/sightings/search/eagle', async (req, res) => {
    try {
        const sightings = await loadSightings();
        const eagleSighting = sightings.find(sighting => 
            sighting.species.toLowerCase().includes("eagle")
        );
        
        if (eagleSighting) {
            res.json(eagleSighting);
        } else {
            res.status(404).json({ message: "No eagle sightings found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/sightings/find-index/moose - Find index of moose
app.get('/api/sightings/find-index/moose', async (req, res) => {
    try {
        const sightings = await loadSightings();
        const mooseIndex = sightings.findIndex(sighting => 
            sighting.species.toLowerCase() === "moose"
        );
        
        if (mooseIndex !== -1) {
            res.json({
                index: mooseIndex,
                sighting: sightings[mooseIndex]
            });
        } else {
            res.status(404).json({ message: "Moose not found in sightings" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/sightings/recent - Return 3 most recent sightings
app.get('/api/sightings/recent', async (req, res) => {
    try {
        const sightings = await loadSightings();
        
        // Sort by date descending (most recent first)
        const sortedSightings = [...sightings].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        // Get top 3 and format response
        const recentSightings = sortedSightings.slice(0, 3).map(sighting => ({
            id: sighting.id,
            date: sighting.date,
            species: sighting.species,
            location: sighting.location,
            verified: sighting.verified
        }));
        
        res.json(recentSightings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`About page: http://localhost:${PORT}/`);
    console.log(`API endpoints available at: http://localhost:${PORT}/api/sightings`);
});


module.exports = app;