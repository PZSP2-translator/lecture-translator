const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// app.get('/', (req, res) => {
//     res.json({ text: "Hello"});
// });


app.use(express.json(), (req, res, next) => {
    console.log(req.body);
    next();
});

app.post('/', (req, res) => {
    console.log('Received:', req.body);
    res.json({ status: 'Data received', data: req.body });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});