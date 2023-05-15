const http = require("http");
const fs = require('fs');
const express = require("express");
const session = require('express-session'); // Import express-session

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// Add session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Variable to store chat data
let chatData = {
    users: {},
    messages: []
};

app.get('/login', (req, res, next) => {
    res.send(`
        <form action="/login" method="POST">
            <input id="username" type="text" name="username" placeholder="Enter your username" required>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/login', (req, res, next) => {
    const { username } = req.body;

    // Update the username for the current session
    req.session.username = username;
    res.redirect('/');
});

app.get('/', (req, res, next) => {
    const username = req.session.username;

    res.send(`
        <h2>Welcome, ${username || 'Guest'}</h2>
        <ul>
            ${chatData.messages.map(message => `<li>${message.username}: ${message.text}</li>`).join('')}
        </ul>
        <form action="/message" method="POST">
            <input id="message" type="text" name="message" placeholder="Type your message" required>
            <button type="submit">Send</button>
        </form>
    `);
});

app.post('/message', (req, res, next) => {
    const username = req.session.username || 'Guest';
    const { message } = req.body;

    chatData.messages.push({ username, text: message });

    res.redirect('/');
});

app.listen(3000);
