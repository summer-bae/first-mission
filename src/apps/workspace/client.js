"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_router_dom_1 = require("react-router-dom");
const index_1 = __importDefault(require("./index"));
const data = window.__INITIAL_STATE__;
react_dom_1.default.hydrate(react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
    react_1.default.createElement(index_1.default, Object.assign({}, data))), document.getElementById('app'));
