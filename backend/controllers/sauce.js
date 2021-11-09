const Sauce = require('../models/Sauce');
//const path = require("path");
const fs = require('fs');

exports.getAllSauces = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res) => {
    //delete req.body._id;
    const reqSauce = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
            ...reqSauce,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        });
        console.log(sauce)
        sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(() => {
        // const filename = sauce.imageUrl.split('/images/')[1];
        // const isInclude = path.join(__dirname, 'images', filename);

        const sauceObject = req.file ?
        {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body};

        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        //console.log('1 - ', sauce);
        let usersLikedTab = sauce.usersLiked;
        let usersDislikedTab = sauce.usersDisliked;
        if(req.body.like === 1){
            usersLikedTab.push(req.body.userId);
            const newLike = usersLikedTab.length;
            //console.log('2 - ', usersLikedTab);
            const updatedSauce = {usersLiked: usersLikedTab, likes: newLike };
            //console.log(updatedSauce);
            Sauce.updateOne({ _id: req.params.id }, { ...updatedSauce, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({ error }));
        } 
        else if (req.body.like === -1) {
            console.log(req.body);
            usersDislikedTab.push(req.body.userId);
            const newDislike = usersDislikedTab.length;
            const updatedSauce = {usersDisliked: usersDislikedTab, dislikes: newDislike };
            Sauce.updateOne({ _id: req.params.id }, { ...updatedSauce, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({ error }));
        }
        else if (req.body.like === 0) {
            const filteredTabOfUsersLiked = usersLikedTab.filter(el => el !== req.body.userId);
            const filteredTabOfUsersDisliked = usersDislikedTab.filter(el => el !== req.body.userId);
            const newLikes = filteredTabOfUsersLiked.length;
            const newDislikes = filteredTabOfUsersDisliked.length;
            const updatedSauce = {usersLiked: filteredTabOfUsersLiked, usersDisliked: filteredTabOfUsersDisliked, likes: newLikes, dislikes: newDislikes };
            //console.log('zz :', req.body, filteredTabOfUsersLiked, newLikes);
            Sauce.updateOne({ _id: req.params.id }, { ...updatedSauce, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
};
