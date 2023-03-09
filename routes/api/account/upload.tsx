import multer from 'multer';

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'src/files/');
	},
	filename: function(req, file, cb) {
		cb(null, req.session.user.id + "_" + file.originalname);
	}
})

export const upload = multer({ storage: storage }).single("file");
