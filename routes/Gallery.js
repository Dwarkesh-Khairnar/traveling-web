import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import db from '../db/connection.js';
import requireLogin from "../middleware/session_auth.js";
const router = express.Router();


//  Gallery Route
router.get('/gallery', (req, res) => {
    const query = 'SELECT * FROM places';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch places' });
        }
        res.json(results); // Send photos posts to the front-end
    });
});



// gallery data
router.post('/gallery/add', (req, res) => {
    const { title, image_url, caption } = req.body;
    db.query('insert into places(name,image_url,description) values(?,?,?)', [title, image_url, caption], (err) => {
        if (err) throw err;
        res.json(results)
    });
});

router.post('/gallery/delete', (req, res) => {
    const { id } = req.body;
    db.query('DELETE FROM places where id=?', [id], err => {
        if (err) throw err;
        res.redirect('/bord')
    });
});

// User gallery Route
router.get('/user/gallery', (req, res) => {
    const query = `SELECT * FROM places where mail=?`;
    db.query(query, [usermail], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch places' });
        }
        res.json(results); // Send photos posts to the front-end
    });
});

 export default router;