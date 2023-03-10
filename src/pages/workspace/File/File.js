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
const file_module_css_1 = __importDefault(require("./file.module.css"));
const jszip_1 = __importDefault(require("jszip"));
// textarea 수정 해보기
function File() {
    const [uploadFile, setUploadFile] = (0, react_1.useState)('');
    const [fileList, setFileList] = (0, react_1.useState)([]);
    const [selectFile, setSelectFile] = (0, react_1.useState)('');
    const [contents, setContents] = (0, react_1.useState)('편집할 파일을 선택해주세요');
    function handlerFileUpload(e) {
        const fileInfo = e.target.files[0];
        const fileName = fileInfo.name.split('.').reverse()[0];
        if (fileName === 'zip') {
            if (fileInfo.size > 1024 * 1024) {
                e.target.value = '';
                alert('🚨 올릴 수 있는 .zip파일의 용량은 1MB 미만입니다');
                setUploadFile('');
                setContents('편집할 파일을 선택해주세요');
                setSelectFile('');
                setFileList([]);
            }
            else {
                console.log(fileInfo);
                setUploadFile(fileInfo);
                setSelectFile('');
                setFileList([]);
            }
        }
        else {
            e.target.value = '';
            alert('.zip 확장자만 업로드 할 수 있습니다');
            setUploadFile('');
            setContents('편집할 파일을 선택해주세요');
            setSelectFile('');
        }
    }
    function getFileList(_e) {
        const file = uploadFile;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e && e.target && e.target.result) {
                jszip_1.default.loadAsync(e.target.result).then((obj) => {
                    setFileList(Object.values(obj.files));
                });
            }
        };
        reader.onerror = (_e) => {
            alert('file open error');
        };
        reader.readAsArrayBuffer(file);
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
    function handlerSaveContents(_e) {
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
    function handlerDirClick(_e) {
        alert('폴더는 편집할 수 없습니다');
    }
    let rootFileName = uploadFile.name;
    if (rootFileName) {
        rootFileName = rootFileName.substr(0, rootFileName.length - 4) + '/';
    }
    const fileListComponent = fileList.map((item, _idx) => {
        if (selectFile === item.name) {
            return (react_1.default.createElement("li", { className: file_module_css_1.default.select, onClick: item.dir
                    ? handlerDirClick
                    : handlerFileClick.bind(this, item.name) }, item.name));
        }
        else {
            return (react_1.default.createElement("li", { className: file_module_css_1.default.noselect, onClick: item.dir
                    ? handlerDirClick
                    : handlerFileClick.bind(this, item.name) }, item.name));
        }
    });
    return (react_1.default.createElement("div", { className: file_module_css_1.default.file_wrapper },
        react_1.default.createElement("div", { className: file_module_css_1.default.file_upload },
            react_1.default.createElement("input", { type: "file", name: "file", id: file_module_css_1.default.w, onChange: handlerFileUpload }),
            react_1.default.createElement("button", { type: "button", className: "btn btn-link", onClick: handlerFileSubmit }, "\uC5C5\uB85C\uB4DC")),
        react_1.default.createElement("div", { className: file_module_css_1.default.file_list },
            react_1.default.createElement("ul", null, fileListComponent
                ? fileListComponent
                : '업로드를 해주세요')),
        react_1.default.createElement("div", { className: file_module_css_1.default.file_textEdit },
            react_1.default.createElement("textarea", { rows: 10, cols: 60, value: contents, onChange: handlerChangeContents }),
            react_1.default.createElement("button", { className: "btn btn-primary", onClick: handlerSaveContents }, "\uC800\uC7A5"))));
}
exports.default = File;
