const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    req.token = jwt.verify(token, 'ySWQiOiI2MTg0OWUyNmY5YjQxNDdjYjkwYzgwYmUiLCJpYXQiOjE2MzcwMjQwNzUsImV4cCI6MTYzNzExMDQ3NX2MTg0OWUyNmY5YjQxNDdjYjkwYzgwYmUi');
    //const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== req.token.userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
