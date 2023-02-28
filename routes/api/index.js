const router = require('express').Router();

router.use('/', require('./account/account'));

module.exports = router;