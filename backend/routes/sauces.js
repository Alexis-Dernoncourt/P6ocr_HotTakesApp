const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer-config');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, upload, sauceCtrl.createSauce);
router.put('/:id', auth, upload, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, upload, sauceCtrl.likeSauce);

module.exports = router;