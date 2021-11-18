const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, 'images');
  },
  filename: (_, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateNow = new Date().toLocaleDateString('fr-FR', options).split(' ').join('_');
    callback(null, name + Date.now() + '_' + dateNow + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');
