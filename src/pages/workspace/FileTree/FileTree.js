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
const react_sortable_tree_1 = __importDefault(require("react-sortable-tree"));
const theme_file_explorer_1 = __importDefault(require("@nosferatu500/theme-file-explorer"));
function FileTree({ files, rootFileName }) {
    function makeTree(files) {
        console.log(files);
        console.log(rootFileName);
        const tree = [{ title: rootFileName, children: [] }];
        files === null || files === void 0 ? void 0 : files.forEach((file) => {
            const path = file.name.split('/');
            let nodeChildren = tree[0].children;
            path.forEach((folderName) => {
                let folderNode = nodeChildren.find((node) => node.title === folderName);
                if (!folderNode) {
                    folderNode = { title: folderName, children: [] };
                    nodeChildren.push(folderNode);
                }
                nodeChildren = folderNode.children;
            });
            nodeChildren.push({
                title: file.name,
                children: [],
            });
        });
        return tree;
    }
    const [treeData, setTreeData] = (0, react_1.useState)(makeTree(files));
    function handleTreeDataChange(newTreeData) {
        setTreeData(newTreeData);
    }
    return (react_1.default.createElement("div", { style: { height: 400 } },
        react_1.default.createElement(react_sortable_tree_1.default, { treeData: treeData, onChange: handleTreeDataChange, theme: theme_file_explorer_1.default })));
}
exports.default = FileTree;
