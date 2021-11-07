const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer-config');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, upload, sauceCtrl.getAllSauces);
router.get('/:id', auth, upload, sauceCtrl.getOneSauce);
router.post('/', auth, upload, sauceCtrl.createSauce);
// router.put('/:id', auth, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;