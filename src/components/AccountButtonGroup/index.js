"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const reactstrap_1 = require("reactstrap");
const react_router_dom_1 = require("react-router-dom");
const style_module_scss_1 = __importDefault(require("./style.module.scss"));
const AccountButtonGroup = ({ buttonLabel, onClickButton, linkLabel, linkTo, }) => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement("div", { className: style_module_scss_1.default.AccountButtonGroup__btn_wrapper },
        react_1.default.createElement(reactstrap_1.Button, { color: "primary", onClick: onClickButton, className: style_module_scss_1.default.AccountButtonGroup__btn }, buttonLabel)),
    react_1.default.createElement("div", { className: style_module_scss_1.default.AccountButtonGroup__link_wrapper },
        react_1.default.createElement(react_router_dom_1.Link, { to: linkTo }, linkLabel))));
exports.default = AccountButtonGroup;
