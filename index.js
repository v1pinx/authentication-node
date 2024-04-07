const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./db');
require('./db')
const jwtSecret = "12345";

const PORT = 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
})

app.get('/login', (req, res) => {
    const token = req.query.auth;
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
    const {email, password} = req.body;
    
    
    try {
        const flag = await User.create({ email, password });

        if (flag) {
            const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

            res.send(token);
        } else {
            res.status(500).send("Error creating user1");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating user2");
    }

    
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJAZ21haWwuY29tIiwiaWF0IjoxNzEyNTEyNzU3LCJleHAiOjE3MTI1MTYzNTd9.UOsE6W_QjtVO5UrHBJgdBY5_rNi2pWdIppkjD8lkD4w