const router = require('express').Router();
const middlewares = require('../../middlewares');

// 프론트에서 검증일 뿐 서버에서 재검증 필요함 middleware 설정 확인
router.get(['/', '/workspace', '/chat'], middlewares.auth.isMember, require('./workspace'));
router.get(['/signup', '/signin'], middlewares.auth.isNotMember, require('./account'));

module.exports = router;