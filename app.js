const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/connection');
const app = express();
const router = express.Router();
const cors =require('cors')
const PORT = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public',express.static('Public'));
app.use('/node_modules', express.static('node_modules'));
app.set('view engine','html');
app.use(cors());

// Home Page Route
app.get('/', function(req, res){
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/distance', (req, res) => {
    res.sendFile(__dirname+'/views/distance.html');
});

app.get('/gallery', (req, res) => {
    res.sendFile(__dirname+'/views/gallery.html');
});

app.get('/blog', (req, res) => {
    res.sendFile(__dirname+'/views/blog.html');
});

app.get('/plasec',(req,res)=>{
    res.sendFile(__dirname+'/views/finde-plesec.html')
})

// Gallery Route
app.get('/gallery', (req, res) => {
    db.query('SELECT * FROM places',(err, results) => {
        if (err) throw err;
        res.json(results); // Send data to front-end for gallery display
    });
});


// Blog Page Route
app.get('/api/blog', (req, res) => {
    console.log('Fetching data from database');
    const query=`SELECT * FROM blog where topreting='top'`;
    db.query(query,(err, results) => {
        if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
        console.log('Data fetched successfully',results);
        res.json(results); // Send blog posts to the front-end

    });
});


// Add Blog Post
app.post('/blog', function(req, res){
    console.log(req.body);
    var title=req.body.title;
    var content=req.body.content;
    // var { title, content } = req.body;
    db.query('INSERT INTO blog (title, content) VALUES (?, ?)',[title, content],(err) => {
        if (err) throw err;
        res.redirect('/blog');
    });
});

// module.exports = router;
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

    // Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
