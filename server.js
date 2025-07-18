const express = require('express')
const app = express();


// "GET /" per server's first message
app.get('/', async (req, res) => {
    res.render("index.ejs")
})

app.listen(3000, () => {
    console.log("listening on port 3000")
})

