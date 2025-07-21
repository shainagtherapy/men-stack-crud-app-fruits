const dotenv = require('dotenv')
dotenv.config();

const express = require('express')
const mongoose = require('mongoose')

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// Import the Fruit model:
const Fruit = require("./models/fruit.js");

// adding middleware for app
app.use(express.urlencoded({ extended: false }));


// "GET /" per server's first message
app.get('/', async (req, res) => {
    res.render("index.ejs")
})

// the index route
app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find();
    console.log(allFruits); // log all the fruits!
    res.send("Welcome to the index page!");
});

// get new fruits
app.get('/fruits/new', async (req, res) => {
    res.render('fruits/new.ejs')
})

// POST /fruits
app.post('/fruits', async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body); // this line is the database transaction
    res.redirect('/fruits/new')
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})

