"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const reactstrap_1 = require("reactstrap");
const DefaultUserInfoInputGroup = ({ onChangeId, onChangePw, id, pw }) => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(reactstrap_1.Input, { onChange: onChangeId, value: id, placeholder: "\uC544\uC774\uB514" }),
    react_1.default.createElement(reactstrap_1.Input, { type: "password", onChange: onChangePw, value: pw, placeholder: "\uBE44\uBC00\uBC88\uD638" })));
exports.default = DefaultUserInfoInputGroup;
