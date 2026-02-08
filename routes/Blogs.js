import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import db from '../db/connection.js';
import requireLogin from "../middleware/session_auth.js";
const router = express.Router();


// Add Blog Post
router.post('/blog',requireLogin, (req, res) => {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();
    const username = req.body.disable_mail?.trim();
    console.log('usename', username);

    if (!title || !content) {
        return res.status(400).send('All fields are required');
    }

    db.query('INSERT INTO blog (title, content,mail) VALUES (?, ?, ?)', [title, content, username], (err) => {
        if (err) throw err;
    });
    res.redirect('/blog');
});

// finel code of blog fetching
router.get('/blog', (req, res) => {
    const query = `SELECT * FROM blog where topreting='top'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
        res.json(results); // Send blog posts to the front-end
    });
});

router.get('/blogs/dashbord', (req, res) => {
    const query = `SELECT * FROM blog `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
        res.json(results); // Send blog posts to the front-end
    });
});

router.post('/blogs/add', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    db.query('INSERT INTO blog (title, content) VALUES (?, ?)', [title, content], (err) => {
        if (err) throw err;
        res.redirect('/bord');
    });
});

// User dashbord section
let usermail;

router.post('/user/blogs/dashbord', (req, res) => {
    let { email } = req.body
    usermail = email;
    const query = `SELECT * FROM blog where mail=?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
        res.json(results); // Send blog posts to the front-end
    });
});

export default router;
