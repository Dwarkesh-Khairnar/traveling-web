// Need to modify this file for router 



// const express = require('express');
// const router = express.Router();
// const db = require('../db/connection');
// const axios = require('axios');

// // Home Page Route
// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/views/index.html'));
// });

// // Gallery Route
// router.get('/gallery', (req, res) => {
//     db.query('SELECT * FROM places', (err, results) => {
//         if (err) throw err;
//         res.json(results); // Send data to front-end for gallery display
//     });
// });


// // Blog Page Route
// router.get('/blog', (req, res) => {
//     db.query('SELECT * FROM blog ORDER BY created_at DESC', (err, results) => {
//         if (err) throw err;
//         res.json(results); // Send blog posts to the front-end
//     });
// });

// // Add Blog Post
// router.post('/add-blog', (req, res) => {
//     const { title, content } = req.body;
//     db.query('INSERT INTO blog (title, content) VALUES (?, ?)', [title, content], (err) => {
//         if (err) throw err;
//         res.redirect('/blog');
//     });
// });

// module.exports = router;

