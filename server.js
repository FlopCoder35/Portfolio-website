const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();  // Load environment variables

const app = express();
const port = 3000;

// Middleware to parse the form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files like CSS or JS if needed
app.use(express.static(path.join(__dirname)));  // Serve files from the root folder

// Route to serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Serve index.html from the main folder
});

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route to handle form submission
app.post('/submit_form', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,  // sender's email
        to: process.env.EMAIL_USER,  // recipient email
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    console.log("message sent to db");

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.redirect('/?status=error');
        }
        console.log('Message sent:', info.response);
        res.redirect('/?status=success');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
