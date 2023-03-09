import express, { Router } from 'express';
const router: Router = express.Router();
import session from "express-session";
import modAccount from '../../../models/account/account';
import * as util from './util';
import Error from '../util/error';
import multer from 'multer';
import AdmZip from 'adm-zip';
import fs from 'fs';
import rimraf from 'rimraf';
import tar from 'tar-fs';

import { upload } from './upload';

declare module 'express-session' {
	export interface SessionData {
		user: any
	}
}

async function findById(id: string) {
	const accountInfo = await modAccount.findOne({ id });
	return accountInfo;
}


async function isExistsById(id: string) {
	const accountInfo = await findById(id);
	return !!accountInfo;
};

async function isExistsAccountInfo(id: string, pw: string) {
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

async function add(id: string, pw: string) {
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
		upload(req, res, function (err: any) {
			if (err instanceof multer.MulterError) {
				return next(err);
			} else if (err) {
				return next(err);
			}

			const filePath = req.file?.path;

			if (filePath?.split('.')[1] === 'zip') {
				const zip = new AdmZip(filePath);
				const target = '../upload/' + req.session.user.id;

				rimraf.sync(target);
				zip.extractAllTo(target, true);

				return res.json(true);
			} else {
				const target = '../upload/' + req.session.user.id;
				rimraf.sync(target);
				if (typeof filePath === 'string') {
					const t = fs.createReadStream(filePath).pipe(
						tar.extract(target, {
							readable: true, // all dirs and files should be readable
							writable: true, // all dirs and files should be writable
						})
					);
				}

				return res.json(true);
			}
		});
	} catch (err) {
		console.log(err);
	}
});

router.get('/file/contents', async (req, res, _next) => {
	try {
		const contents = fs.readFileSync(
			'../upload/' + req.session.user.id + '/' + req.query.filename,
			'utf8'
		);
		res.send(contents);
	} catch (err) {
		console.log(err);
	}
});

router.post('/file/contents', async (req, res, _next) => {
	try {
		const { filename, contents } = req.body;

		fs.writeFileSync(
			'../upload/' + req.session.user.id + '/' + filename,
			contents,
			'utf8',
		);

		res.send(true);
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;