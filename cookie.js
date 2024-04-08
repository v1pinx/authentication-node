const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const User = require('./db');
require('./db');

const jwtSecret = "12345";
const PORT = 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser middleware

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

app.get('/login', (req, res) => {
    const token = req.cookies.auth; // Access token from cookie

    if (token) {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            res.send(`Logged in as ${decoded.email}`);
        } catch (error) {
            res.status(401).send("Invalid or expired token");
        }
    } else {
        res.status(401).send("Token not provided");
    }
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const flag = await User.create({ email, password });

        if (flag) {
            const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

            // Set token as a cookie
            res.cookie('auth', token, { httpOnly: true, maxAge: 3600000 }); // Max age in milliseconds (1 hour)

            res.send(token);
        } else {
            res.status(500).send("Error creating user");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating user");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
