const express = require('express');
const session = require('express-session')
var bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/connection');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static('Public'));
app.use('/node_modules', express.static('node_modules'));
app.set('view engine', 'html');
app.use(cors());

// session verification
app.use(session({
    secret: "22!@3wffr",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
);

//   middleware to check if user is logged in 
const requireLogin = (req, res, next) => {
    if (req.session.logIn) {
        next();
    } else {
        // res.data-bs-target("#modelId")
        res.redirect('/login')
        // return res.status(400).json({message:'Login need for use this feacher'})
    }
}

// Home Page Route
app.get('/', (req, res) => {
    if (req.session.logIn) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

// Demo web page
app.get('/Demo-home', function (req, res) {
    res.sendFile(__dirname + '/views/demo_home.html');
});

// app.get('/home', requireLogin, (req, res) => {
//     res.sendFile(__dirname + '/views/home.html');
// });

// Main Home page 
app.get('/home', requireLogin, (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

// distance page
app.get('/distance', (req, res) => {
    res.sendFile(__dirname + '/views/distance.html');
});

app.get('/gallery', (req, res) => {
    res.sendFile(__dirname + '/views/gallery.html');
});

app.get('/blog', (req, res) => {
    res.sendFile(__dirname + '/views/blog.html');
});

app.get('/find', (req, res) => {
    res.sendFile(__dirname + '/views/finde-plesec.html')
})

app.get('/sing', (req, res) => {
    res.sendFile(__dirname + '/views/sing-in.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
})

app.get('/forgot', (req, res) => {
    res.sendFile(__dirname + '/views/forgotpass.html')
})

app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/views/contact.html')
})

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html')
})

app.get('/userbord', (req, res) => {
    res.sendFile(__dirname + '/views/userdashbord.html')
})
app.get('/bord', requireLogin, (req, res) => {
    res.sendFile(__dirname + '/views/Dashbord.html')
})

// otp generate
var otp;
function otpnumber() {
    let otp1 = Math.random().toFixed(6).replace('0.', '')
    otp = otp1;
    console.log(otp);
}

// Mail sending code
const transporter = nodemailer.createTransport(
    {
        // loacl smtp data
        secure: true,
        // host: 'smtp.gmail.com',
        // post: 465,
        // auth: {
        //     user: 'example@gmail.com', // remove with Company mail
        //     pass: 'gmail_app_password'              // Create in hosting mashine
        // }

        // parmanet turbo smtp server data
        host: 'pro.turbo.com',
        post: 25,
        secure: true,
        auth: {
            user: 'abc@example.com',
            pass: 'smtp-server_password'
        },
        family: 4
    }
);

// function sendmail(to, sub, msg) {
//     try {
//         transporter.sendMail({
//             to: to,
//             subject: sub,
//             html: msg
//         });
//         res.json({ message: 'Mail send Successfully' })
//     } catch (error) {
//         res.status(500).json({ message: 'Mail sending error occurred' })
//     }
// }


//  Gallery Route
app.get('/api/gallery', (req, res) => {
    // console.log('Fetching data from database /gallery');
    const query = 'SELECT * FROM places';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch places' });
        }
        res.json(results); // Send photos posts to the front-end
        // console.log(results);

    });
});


let lat, lng, finelsearch;
app.post('/redirect1', async (req, res) => {
    try {
        lat = req.body.lat1;
        lng = req.body.lng1;
        cityname = req.body.finelsearch;
        console.log(lat, lng, finelsearch);
        res.json({ lat: lat, lng: lng, cityname: cityname, redirectto: '/find' });
    } catch (error) {
        console.error(error);

    }
});

app.get('/api/find', (req, res) => {
    res.json({ lat: lat, lng: lng, cityname: cityname })
})

// Add Blog Post
app.post('/blog', requireLogin, (req, res) => {
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

// blogs finders code
app.post('/find-blogs', (req, res) => {
    const word = req.body.city;

    const query = `SELECT * FROM blog where title like '%${word}%'`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch blog posts' + err });
        }
        if (results.length > 0) {
            res.json(results); // Send blog posts to the front-end 

        } else {
            res.status(404).json({ message: `"${word}" word releted blog are not found` })
        }
    });
});



// finel code of blog fetching
app.get('/api/blog', (req, res) => {
    const query = `SELECT * FROM blog where topreting='top'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
        res.json(results); // Send blog posts to the front-end
    });
});


app.post('/sing', async (req, res) => {
    const username0 = req.body.name;
    const sirname = req.body.sirname
    const mailid = req.body.mailid;
    const contact = req.body.contact;
    const s_question = req.body.question;
    const answer = req.body.ansewer;
    const password0 = req.body.fist_pass;
    const confirmpass = req.body.confirm;

    // hash a password 
    // console.log(username0, sirname, mailid, contact, password0, confirmpass);
    let hashpass;
    try {
        hashpass = await bcrypt.hash(password0, 8);
    } catch (error) {
        console.error("Error hashing password:", error);
        return res.status(500).json({ message: "Error prossing password." })
    }

    db.query('INSERT INTO login (name,sirname,mail,contact,password,S_question,ansewer) VALUES (?,?,?,?,?,?,?)', [username0, sirname, mailid, contact, hashpass, s_question, answer], (err, results) => {

        if (err) return res.status(500).json({ message: 'Data alredy exist' });


        if (password0 == confirmpass) {
            return res.json({ message: "Finelly new one more user ya...ya...", redirectto: '/' });
        } else {
            return res.status(500).json({ message: 'Both Password Is Not Match' })
        }
    });
});

app.post('/login', async (req, res) => {
    try {
        const mail1 = req.body.mail;
        const pass = req.body.pass;

        if (!mail1 || !pass) {
            return res.status(500).json({ message: 'Usename or Password will be empty' })
        }

        db.query('SELECT * FROM login WHERE mail = ?', [mail1], async (err, results) => {

            if (err) {
                return res.status(500).json({ message: 'Database Server Error' });
            }

            if (results.lenght === 0) {
                // console.log('No user founnd for Username: ', username);
                return res.status(400).json({ message: 'User not found' })
            }

            const logDB = results[0];

            if (!logDB || typeof logDB.password !== 'string' || logDB.password.lenght < 30) {
                return res.status(401).json({ message: 'Wrong Username or Password' })
            }

            const Adminmail = ['dwarkeshkhairnar12+admin@gmail.com', 'admin1@gmial.com', 'admin2@gmial.com', 'admin3@gmailcom']
            const name = logDB.name;
            const sirname2 = logDB.sirname;
            const boss = logDB.boss;
            const mail = logDB.mail;

            req.session.logIn = true;

            const isMatch = await bcrypt.compare(pass, logDB.password)

            if (Adminmail.includes(mail1)) {

                return res.json({ message: "Login Successful", name, sirname2, boss, redirectto: '/bord' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect Password' })
            }

            res.json({ message: "Login Successful", name, sirname2, boss, mail, redirectto: '/home' });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'login failed' })
    }
});

// app.get('/api/dashbord', requireLogin, (req, res) => {
//     res.json({ username: req.session.username });
// });

app.post('/contact', async (req, res) => {
    const mail = req.body.mail;
    const issue = req.body.issue;
    const discreption = req.body.discreption;


    try {
        async function sendmail(to, sub, msg) {
            await transporter.sendMail({
                from: '"User Mail" <otp_by_travel1@proton.me>',
                to: to,
                subject: sub,
                html: msg
            });
        }
        await sendmail(`dwarkeshkhairnar12@gmail.com`, `${issue}`, `${discreption} <br> From:<a style="">${mail}</a>`);
        res.json({ message: 'Note:Mail send Successfully wait 2-3 hours fro replay', color: '#00b509' })
    } catch (error) {
        res.status(500).json({ message: 'Mail sending error please try same time leter', color: 'red' })
    }
});

app.post('/api/forgot', async (req, res) => {
    const email = req.body.mail;
    if (!email) {
        return res.status(500).json({ message: 'Mail fillde is ematy', color: 'red' })
    }
    otpnumber();

    try {
        async function sendmail(to, sub, msg) {
            await transporter.sendMail({
                from: '"Travel With Us"<otp_by_travel1@proton.me>',
                to: to,
                subject: sub,
                html: msg
            });
            await sendmail(`${email}`, `Your Khairnar Crop Travel ${otp}`, `Here's your One time Password (OTP) for your Khairnar Corporation travel application:<b>${otp}</b>. This code is valid for 3 minute.<br><br><p>Copy otp manualy please</p>`)
            res.json({ message: 'Otp send Successfully!!', color: 'green' })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Otp sending error occurred..!', color: 'red' })
    }

    // res.json({ message: 'Mail send Successfully' });
});


// Ans reset section
app.post('/forgot_ans', async (req, res) => {

    try {
        const mail = req.body.mail;
        const question = req.body.question;
        const ans = req.body.ansewer;
        const password = req.body.password;
        const comfirm = req.body.comfirm;


        const newhashpass = await bcrypt.hash(password, 10);

        db.query('SELECT * FROM login WHERE mail = ?', [mail], async (error, results) => {

            if (error) {
                return res.status(400).json({ message: 'Database Error so try agen letar' })
            }
            const data = results[0]
            //  console.log(data);

            if (results.length === 0) {
                return res.status(400).json({ message: 'User not found or incorrect data provide' })
            }

            const qusetionmatch = data.S_question == question;
            const ansmatch = data.ansewer == ans;

            console.log(qusetionmatch, ',', ansmatch);


            if (!qusetionmatch) {
                return res.status(400).json({ message: 'Choose question is not match to database' })
            }

            if (!ansmatch) {
                return res.status(400).json({ message: 'Ansewer is not match to database' })
            }

            if (password == comfirm) {

                db.query('UPDATE login SET password = ? WHERE mail = ?', [newhashpass, mail], async (err, results) => {
                    console.log(results);

                    if (err) {
                        return res.status(400).json({ message: 'Password has bin not change please try again' })
                    }

                    res.json({ message: 'Note:This time remeber your password and your Password chenge Successfull', mail, question, ans, redirectto: '/login' })
                    console.log('ans');
                })
            }
        })

    } catch (error) {
        console.error("Data not find pleses retry", error);
    };
})

// Otp resat section 
app.post('/forgot_otp', async (req, res) => {

    try {
        const mail = req.body.mail;
        const password = req.body.password;
        const comfirm = req.body.comfirm;
        const otpnumber1 = req.body.otpnum;
        const Numberotp = otp == otpnumber1

        console.log(mail, password, comfirm, otpnumber1, Numberotp);

        const newhashpass = await bcrypt.hash(password, 10);

        db.query('SELECT * FROM login WHERE mail = ?', [mail], async (err, results) => {

            const data = results[0]
            console.log(data);

            if (results.length === 0) {
                return res.status(400).json({ message: 'User not found or incorrect data provide' })
            }
            if (err) {
                return res.status(500).json({ message: 'Database Server Error' });
            }

            if (!Numberotp) {
                return res.status(400).json({ message: 'Otp is not match' })
            }

            if (password == comfirm) {
                // console.log(data)

                db.query('UPDATE login SET password = ? WHERE mail = ?', [newhashpass, mail], async (err, results) => {
                    console.log(results);

                    if (err) {
                        return res.status(400).json({ message: 'Password has bin not change please try again' })
                    }

                    res.json({ message: 'Note:This time remeber your password and your Password chenge Successfull', mail, redirectto: '/login' })
                    console.log('otp');
                })
            }
        })
    } catch (error) {
        console.error(error);

    };
})

// Dashbord shection

app.get('/api/users', (req, res) => {
    // console.log('Fetching data from database /Users');
    const query = 'SELECT * FROM login';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch places' });
        }
        res.json(results); // Send userdata posts to the front-end
        // console.log(results);

    });
});

app.get('/api/blogs/dashbord', (req, res) => {
    const query = `SELECT * FROM blog `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
        res.json(results); // Send blog posts to the front-end
    });
});

app.post('/api/blogs/add', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    db.query('INSERT INTO blog (title, content) VALUES (?, ?)', [title, content], (err) => {
        if (err) throw err;
        res.redirect('/bord');
    });
});

app.post('/api/blogs/delete', (req, res) => {
    const { id } = req.body;

    db.query('DELETE from blog where idblog=?', [id], err => {
        if (err) throw err;
        res.redirect('/bord')
    });
});

// Chart

app.get('/api/stats', (req, res) => {
    const stats = [];
    db.query('select count(*) as count from login', (err, users) => {
        stats.users = users[0].count;
        db.query('select count(*) as count from blog', (err, blogs) => {
            stats.blogs = blogs[0].count;
            db.query('select count(*) as count from places', (err, gallery) => {
                stats.gallery = gallery[0].count;
                res.json({ users: users, blogs: blogs, gallery: gallery })
            })
        })
    })
})

// User data
app.post('/api/users/update', (req, res) => {
    const { id, name } = req.body;
    db.query('update login set name=? where id=?', [name, id], err => {
        if (err) throw err;
        res.redirect('/bord')
    });
});

app.post('/api/users/delete', (req, res) => {
    const { id } = req.body;
    db.query('DELETE from login where idlogin=?', [id], err => {
        if (err) throw err;
        res.redirect('/bord')
    });
});

// gallery data
app.post('/api/gallery/add', (req, res) => {
    const { title, image_url, caption } = req.body;
    db.query('insert into places(name,image_url,description) values(?,?,?)', [title, image_url, caption], (err) => {
        if (err) throw err;
        res.json(results)
    });
});

app.post('/api/gallery/delete', (req, res) => {
    const { id } = req.body;
    db.query('DELETE FROM places where id=?', [id], err => {
        if (err) throw err;
        res.redirect('/bord')
    });
});




// User dashbord section
let usermail;

app.post('/api/user/blogs/dashbord', (req, res) => {
    let {email}= req.body
usermail=email;
    const query = `SELECT * FROM blog where mail=?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
        res.json(results); // Send blog posts to the front-end
    });
});

// User gallery Route
app.get('/api/user/gallery', (req, res) => {
    // console.log('Fetching data from database /gallery');
    const query = `SELECT * FROM places where mail=?`;
    db.query(query,[usermail], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch places' });
        }
        res.json(results); // Send photos posts to the front-end
    });
});















app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error in logout', err);
            return res.send("Logout failed.")
        }
        res.redirect('/login')
    });
});

// Database connection veryfication
db.connect((err) => {
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
