const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const userRoutes = require('./routes/users');

const app = express();

// DB CONNEXION
mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.password}@cluster0.fmlqg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// app.use((req, res) => {
//     res.json({ message: 'Votre requête a bien été reçue !' }); 
// });

//app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;