const router = require('express').Router();
const modAccount = require('../../../models/account/account');
const util = require('./util');
const Error = require('../util/error');
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const rimraf = require('rimraf');

const upload = require('../../../src/upload');

const findById = async (id) => {
	const accountInfo = await modAccount.findOne({ id });
	return accountInfo;
};

const isExistsById = async (id) => {
	const accountInfo = await findById(id);
	return !!accountInfo;
};

const isExistsAccountInfo = async (id, pw) => {
	if (!id || !pw) {
		throw new Error.InvalidRequest();
	}

	const accountInfo = await findById(id);
	if (!accountInfo) {
		throw new Error.IncorrectAccount();
	}

	const isEqualPw = await util.isEqualPw(pw, accountInfo.pw);
	if (!isEqualPw) {
		throw new Error.IncorrectAccount();
	}

	return true;
};

const add = async (id, pw) => {
	if (!id || !pw) {
		throw new Error.InvalidRequest();
	}

	const isExists = await isExistsById(id);

	if (isExists) {
		throw new Error.AlreadyExists();
	}

	const hashedPw = await util.genHashedPw(pw);
	const newAccountInfo = new modAccount({ id, pw: hashedPw });

	await newAccountInfo.save();
	return true;
};

router.post('/account/signup', async (req, res, next) => {
	try {
		const { id, pw } = req.body;
		const ret = await add(id, pw);
		res.send(ret);
	} catch (err) {
		next(err);
	}
});

router.post('/account/signin', async (req, res, next) => {
	try {
		const { id, pw } = req.body;
		const ret = await isExistsAccountInfo(id, pw);
		req.session.user = { id };
		res.send(ret);
	} catch (err) {
		next(err);
	}
});

router.get('/account/signout', (req, res) => {
	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.clearCookie('app.sid', { path: '/' });
		}
		res.redirect('/');
	});
});

router.get('/account/id', (req, res) => {
	res.send(req.session && req.session.user && req.session.user.id);
	console.log(req.session && req.session.user && req.session.user.id);
});

router.post('/file/upload', async (req, res, next) => {
	try {
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				return next(err);
			} else if (err) {
				return next(err);
			}

			const filePath = req.file.path;
			const zip = new AdmZip(filePath);
			const target = '../upload/' + req.session.user.id;

			rimraf.sync(target);
			zip.extractAllTo(target, true);

			return res.json(true);
		});
	} catch (err) {
		console.log(err);
	}
});

router.get('/file/contents', async (req, res, next) => {
	try {
		console.log(req.query.filename);
		const contents = fs.readFileSync(
			'../upload/' + req.session.user.id + '/' + req.query.filename,
			'utf8'
		);
		res.send(contents);
		console.log(contents);
	} catch (err) {
		console.log(err);
	}
});

router.post('/file/contents', async (req, res, next) => {
	try {
		const { filename, contents } = req.body;

		fs.writeFileSync(
			'../upload/' + req.session.user.id + '/' + filename,
			contents,
			'utf8',
			(error) => {
				console.log('write end');
			}
		);

		res.send(true);
	} catch (err) {
		console.err(err);
	}
});

module.exports = router;