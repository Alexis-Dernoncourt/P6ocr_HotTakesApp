const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
  const pwd = req.body.password;
  const mail = req.body.email;
  const passwordCheck = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()+,-./:;=?@\\[\\]^_`{|}~])[A-Za-z0-9!#$%&()+,-./:;=?@\\[\\]^_`{|}~]{8,}$");
  const mailCheck = new RegExp("^[a-zA-Z0-9.!#$%&*+/=?^_{|}~\-]+@[a-zA-Z0-9.!#$%&*+/=?^_~\-]+\\.[a-zA-Z0-9]{2,}$", "ig");
  if (pwd !== "" && mail !== "" && passwordCheck.test(pwd) && mailCheck.test(mail)) {
    bcrypt.hash(pwd, 10)
      .then(hash => {
          const user = new User({
              email: mail.trim(),
              password: hash
          });
          user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    throw new Error("Mot de passe ou email erroné");
  }
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'ySWQiOiI2MTg0OWUyNmY5YjQxNDdjYjkwYzgwYmUiLCJpYXQiOjE2MzcwMjQwNzUsImV4cCI6MTYzNzExMDQ3NX2MTg0OWUyNmY5YjQxNDdjYjkwYzgwYmUi',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};
