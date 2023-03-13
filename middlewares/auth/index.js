const isMember = (session) => session && session.user && session.user.id;

exports.isMember = (req, res, next) => {
	console.log('isMember', req.session);
	if (isMember(req.session)) {
		next();
		return;
	}
	res.redirect('/signin');
};

exports.isNotMember = (req, res, next) => {
	console.log('isNotMember', req.session);
	if (isMember(req.session)) {
		res.redirect('workspace');
		return;
	}

	next();
};
