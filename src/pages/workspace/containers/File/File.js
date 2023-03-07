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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const file_css_1 = __importDefault(require("./file.css"));
const JSZip = require('jszip');
function File() {
    const [uploadFile, setUploadFile] = (0, react_1.useState)('');
    const [fileList, setFileList] = (0, react_1.useState)([]);
    const [selectFile, setSelectFile] = (0, react_1.useState)('');
    const [contents, setContents] = (0, react_1.useState)('편집할 파일을 선택해주세요');
    function handlerFileUpload(e) {
        const fileInfo = e.target.files[0];
        const fileName = fileInfo.name.substr(fileInfo.name.length - 3);
        if (['zip', 'tar'].includes(fileName)) {
            setUploadFile(fileInfo);
            setSelectFile('');
        }
        else {
            e.target.value = '';
            alert('.zip, .tar 확장자만 업로드 할 수 있습니다');
        }
    }
    function getFileList(e) {
        const file = uploadFile;
        const reader = new FileReader();
        if (file.name.substr(file.name.length - 3) === 'zip') {
            reader.onload = (e) => {
                JSZip.loadAsync(e.target.result).then((obj) => {
                    setFileList(Object.values(obj.files));
                });
            };
            reader.onerror = (e) => {
                alert('file open error');
            };
            reader.readAsArrayBuffer(file);
        }
        else {
        }
    }
    function handlerFileSubmit(e) {
        if (!uploadFile) {
            alert('파일을 선택해주세요');
            return;
        }
        const formData = new FormData();
        formData.append('file', uploadFile);
        axios_1.default.post('api/file/upload', formData).then(({ data }) => {
            if (data) {
                getFileList(e);
            }
        });
    }
    function handlerFileClick(value) {
        setSelectFile(value);
        axios_1.default
            .get('api/file/contents', {
            params: { filename: value },
        })
            .then(({ data }) => {
            setContents(data);
        });
    }
    function handlerChangeContents(e) {
        setContents(e.target.value);
    }
    function handlerSaveContents(e) {
        if (selectFile) {
            axios_1.default
                .post('api/file/contents', {
                filename: selectFile,
                contents: contents,
            })
                .then(() => {
                alert('저장하였습니다');
                setUploadFile('');
                setContents('편집할 파일을 선택해주세요');
                setSelectFile('');
            });
        }
    }
    function handlerDirClick(e) {
        alert('폴더는 편집할 수 없습니다');
    }
    // render() {
    let rootFileName = uploadFile.name;
    if (rootFileName) {
        rootFileName = rootFileName.substr(0, rootFileName.length - 4) + '/';
    }
    const fileListComponent = fileList.map((item, idx) => {
        if (selectFile === item.name) {
            return (react_1.default.createElement("li", { className: file_css_1.default.select, onClick: item.dir ? handlerDirClick : handlerFileClick.bind(this, item.name) }, item.name));
        }
        else {
            return (react_1.default.createElement("li", { className: file_css_1.default.noselect, onClick: item.dir ? handlerDirClick : handlerFileClick.bind(this, item.name) }, item.name));
        }
    });
    return (react_1.default.createElement("div", { className: file_css_1.default.file_wrapper },
        react_1.default.createElement("div", { className: file_css_1.default.file_upload },
            react_1.default.createElement("input", { type: "file", name: "file", id: file_css_1.default.w, onChange: handlerFileUpload }),
            react_1.default.createElement("button", { type: "button", className: "btn btn-link", onClick: handlerFileSubmit }, "\uC5C5\uB85C\uB4DC")),
        react_1.default.createElement("div", { className: file_css_1.default.file_list },
            react_1.default.createElement("ul", null, fileListComponent ? fileListComponent : '업로드를 해주세요')),
        react_1.default.createElement("div", { className: file_css_1.default.file_textEdit },
            react_1.default.createElement("textarea", { rows: "10", cols: "60", value: contents, onChange: handlerChangeContents }),
            react_1.default.createElement("button", { className: "btn btn-primary", onClick: handlerSaveContents }, "\uC800\uC7A5"))));
    // }
}
exports.default = File;
