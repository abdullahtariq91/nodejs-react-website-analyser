const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const websiteController = require('./website');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));


app.post('/api/website', (req, res) => {
  websiteController.analyseWebsite(req).then((data) => {
    res.send(data);
  }).catch((err) => { res.send(err.message);});
});

app.listen(8080, () => console.log('Listening on port 8080!'));
