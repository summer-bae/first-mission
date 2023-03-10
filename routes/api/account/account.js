"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const account_1 = __importDefault(require("../../../models/account/account"));
const util = __importStar(require("./util"));
const error_1 = __importDefault(require("../util/error"));
const multer_1 = __importDefault(require("multer"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_1 = __importDefault(require("fs"));
const rimraf_1 = __importDefault(require("rimraf"));
const path_1 = __importDefault(require("path"));
const upload_1 = require("./upload");
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const accountInfo = yield account_1.default.findOne({ id });
        return accountInfo;
    });
}
function isExistsById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const accountInfo = yield findById(id);
        return !!accountInfo;
    });
}
function isExistsAccountInfo(id, pw) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id || !pw) {
            throw new error_1.default.InvalidRequest();
        }
        const accountInfo = yield findById(id);
        if (!accountInfo) {
            throw new error_1.default.IncorrectAccount();
        }
        const isEqualPw = yield util.isEqualPw(pw, accountInfo.pw);
        if (!isEqualPw) {
            throw new error_1.default.IncorrectAccount();
        }
        return true;
    });
}
function add(id, pw) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id || !pw) {
            throw new error_1.default.InvalidRequest();
        }
        const isExists = yield isExistsById(id);
        if (isExists) {
            throw new error_1.default.AlreadyExists();
        }
        const hashedPw = yield util.genHashedPw(pw);
        const newAccountInfo = new account_1.default({ id, pw: hashedPw });
        yield newAccountInfo.save();
        return true;
    });
}
router.post('/account/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, pw } = req.body;
        const ret = yield add(id, pw);
        res.send(ret);
    }
    catch (err) {
        next(err);
    }
}));
router.post('/account/signin', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, pw } = req.body;
        const ret = yield isExistsAccountInfo(id, pw);
        req.session.user = { id };
        res.send(ret);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/account/signout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.clearCookie('app.sid', { path: '/' });
        }
        res.redirect('/');
    });
});
router.get('/account/id', (req, res) => {
    res.send(req.session && req.session.user && req.session.user.id);
    console.log(req.session && req.session.user && req.session.user.id);
});
router.post('/file/upload', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, upload_1.upload)(req, res, function (err) {
            var _a;
            if (err instanceof multer_1.default.MulterError) {
                console.log(err);
                return res.json(false);
            }
            else if (err) {
                console.log(err);
                return res.json(false);
            }
            const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            const zip = new adm_zip_1.default(filePath);
            const target = './routes/api/upload/' + req.session.user.id;
            // rimraf.sync(target);
            zip.extractAllTo(target, true);
            rimraf_1.default.sync('./routes/api/upload/' + req.session.user.id + '/__MACOSX');
            return res.json(true);
        });
    }
    catch (err) {
        console.log(err);
    }
}));
function isPathAllowed(allowedPaths, filepath) {
    // get the absolute path of the filepath
    const absolutePath = path_1.default.resolve(filepath);
    // check if the absolute path starts with any of the allowed paths
    return allowedPaths.some((allowedPath) => absolutePath.startsWith(allowedPath));
}
router.get('/file/contents', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        rimraf_1.default.sync('./routes/api/upload/' + req.session.user.id + '/__MACOSX');
        const contents = fs_1.default.readFileSync('./routes/api/upload/' +
            req.session.user.id +
            '/' +
            req.query.filename, 'utf8');
        res.send(contents);
    }
    catch (err) {
        console.log(err);
    }
}));
router.post('/file/contents', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, contents } = req.body;
        fs_1.default.writeFileSync('./routes/api/upload/' + req.session.user.id + '/' + filename, contents, 'utf8');
        res.send(true);
    }
    catch (err) {
        console.error(err);
    }
}));
module.exports = router;
