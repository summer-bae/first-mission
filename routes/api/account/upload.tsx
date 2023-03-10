import multer from 'multer';

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, 'src/files/');
	},
	filename: function (req, file, cb) {
		cb(null, req.session.user.id + '_' + file.originalname);
	},
});

export const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 },
}).single('file');
