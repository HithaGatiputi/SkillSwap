const express = require('express');
const { autocompleteSkills, searchProviders } = require('../controllers/skillController');
const router = express.Router();

router.get('/autocomplete', autocompleteSkills);
router.get('/search', searchProviders);

module.exports = router;
