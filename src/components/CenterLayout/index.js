"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const style_module_scss_1 = __importDefault(require("./style.module.scss"));
const CenterLayout = ({ children }) => (react_1.default.createElement("div", { className: style_module_scss_1.default.CenterLayout_wrapper },
    react_1.default.createElement("div", { className: style_module_scss_1.default.CenterLayout }, children)));
exports.default = CenterLayout;
