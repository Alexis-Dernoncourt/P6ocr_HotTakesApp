const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://dbAdmin:AeSVbvs98yR4pycs@cluster0.fmlqg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;