const express = require('express');
const bodyParser = require('body-parser');
const shortId = require('shortid');
const mongoose = require('mongoose');

const ShortUrl = require('./models/url.model')

mongoose.connect('mongodb+srv://agathe:Poisson123@freecluster.casgd.mongodb.net/urlshorten?retryWrites=true&w=majority',
  {
    dbName: 'url-shortner',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



const app = express();
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());


//create
app.post('/api/create', async (req, res, next) => {
  const url = req.body.url;
  const name = req.body.name;

  const shortUrl = new ShortUrl({ url: url, name: name, shortId: shortId.generate() })
  const result = await shortUrl.save()

    .then(shortUrl => res.status(201).json(shortUrl))
    .catch(error => res.status(400).json({ error }));

})

//delete
app.delete('/api/url/:id', (req, res, next) => {
  ShortUrl.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Url deleted  !' }))
    .catch(error => res.status(400).json({ error }));
});

// get one url 
app.get('/api/url/:shortId', async (req, res, next) => {
  try {
    const { shortId } = req.params
    const result = await ShortUrl.findOne({ shortId })
    res.status(200).json(result);
  } catch (error) {
    next(error)
  }

})

//get one url send big link 
app.get('/api/newUrl/:shortId', async (req, res, next) => {
  try {
    const shortId = req.params
    const result = await ShortUrl.findOne({ shortId })
    res.status(200).json(result.url);
  } catch (error) {
    next(error)
  }

})

/* display all urls */
app.get('/api/allUrls', (req, res, next) => {
  ShortUrl.find()
    .then(url => res.status(200).json(url))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;