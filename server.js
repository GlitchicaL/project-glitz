const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is running on Port ${port}`);
});

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.render('index.ejs');
})