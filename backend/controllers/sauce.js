const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (_, res) => {
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
    const reqSauce = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
            ...reqSauce,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        });
        if (sauce.userId === req.token.userId) {
            sauce.save()
            .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
            .catch(error => res.status(400).json({ error }));
        } else {
            res.status(401).json({ error: "userId non valide"});
        }
};

exports.modifySauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        if (req.file) {
            const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` };
            if (sauceObject.userId === sauce.userId) {
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                    .catch(error => res.status(400).json({ error }));
                });
            } else {
                res.status(401).json({ error: "Vous n'êtes pas autorisé à réaliser cette action."});
            }
        } else {
            if (sauce.userId === req.token.userId) {
                Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({ error }));
            } else {
                res.status(401).json({ error: "Vous n'êtes pas autorisé à réaliser cette action"});
            }
        }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if (sauce.userId === req.token.userId) {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
            });
        } else {
            res.status(401).json({ error: "Vous n'êtes pas autorisé à réaliser cette action."});
        }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const usersLikedTab = sauce.usersLiked;
        const usersDislikedTab = sauce.usersDisliked;
        if(req.body.like === 1) {
            usersLikedTab.push(req.body.userId);
            const newLike = usersLikedTab.length;
            const updatedSauce = {usersLiked: usersLikedTab, likes: newLike };
            Sauce.updateOne({ _id: req.params.id }, { ...updatedSauce, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({ error }));
        } else if (req.body.like === -1) {
            usersDislikedTab.push(req.body.userId);
            const newDislike = usersDislikedTab.length;
            const updatedSauce = {usersDisliked: usersDislikedTab, dislikes: newDislike };
            Sauce.updateOne({ _id: req.params.id }, { ...updatedSauce, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({ error }));
        } else if (req.body.like === 0) {
            const filteredTabOfUsersLiked = usersLikedTab.filter(el => el !== req.body.userId);
            const filteredTabOfUsersDisliked = usersDislikedTab.filter(el => el !== req.body.userId);
            const newLikes = filteredTabOfUsersLiked.length;
            const newDislikes = filteredTabOfUsersDisliked.length;
            const updatedSauce = {usersLiked: filteredTabOfUsersLiked, usersDisliked: filteredTabOfUsersDisliked, likes: newLikes, dislikes: newDislikes };
            Sauce.updateOne({ _id: req.params.id }, { ...updatedSauce, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
};
