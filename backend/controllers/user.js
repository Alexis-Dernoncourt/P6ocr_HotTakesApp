const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const match = require('../utils/regex');

exports.signup = (req, res) => {
  const pwd = req.body.password;
  const mail = req.body.email;
  if (pwd !== "" && mail !== "" && match.regex.passwordCheck.test(pwd) && match.regex.mailCheck.test(mail)) {
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
  const pwd = req.body.password;
  const mail = req.body.email;
  if (pwd !== "" && mail !== "" && match.regex.passwordCheck.test(pwd) && match.regex.mailCheck.test(mail)) {
    User.findOne({ email: mail })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(pwd, user.password)
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
  } else {
      throw new Error("Mot de passe ou email erroné, veuillez réessayer");
  }
};
