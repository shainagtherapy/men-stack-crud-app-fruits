const dotenv = require('dotenv')
dotenv.config();

const express = require('express')
const app = express();
const mongoose = require('mongoose')
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// Import the Fruit model:
const Fruit = require("./models/fruit.js");

// adding middleware for app
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

// "GET /" per server's first message
app.get('/', async (req, res) => {
    res.render("index.ejs")
})

// the index route
app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find({});
    // console.log(allFruits); // log all the fruits!
    // res.send("Welcome to the fruit index page!");
    res.render('fruits/index.ejs', {fruits: allFruits})
});

// get new fruits
app.get('/fruits/new', async (req, res) => {
    res.render('fruits/new.ejs')
})

app.get("/fruits/:fruitId", async (req, res) => {
    // res.send(`This route renders the show page for fruit id: ${req.params.fruitId}!`)
    const foundFruit = await Fruit.findById(req.params.fruitId)
    res.render('fruits/show.ejs', { fruit: foundFruit })
})



// POST /fruits
app.post('/fruits', async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body); // this line is the database transaction
    res.redirect('/fruits')
})

// DELETE route
app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})

