const router = require('express').Router();

router.use('/account', require('./account/account'));

module.exports = router;