import React, { useState } from 'react';
import SortableTree, { TreeItem } from 'react-sortable-tree';
import FileExplorerTheme from '@nosferatu500/theme-file-explorer';

interface File {
	name: string;
}

interface TreeNode {
	title: string;
	children: TreeNode[];
}

interface FileTreeProps {
	files: File[];
	rootFileName: string;
}

function FileTree({ files, rootFileName }: FileTreeProps) {
	function makeTree(files: File[]): TreeNode[] {
		console.log(files);
		console.log(rootFileName);
		const tree: TreeNode[] = [{ title: rootFileName, children: [] }];

		files?.forEach((file) => {
			const path = file.name.split('/');
			let nodeChildren = tree[0].children;

			path.forEach((folderName) => {
				let folderNode = nodeChildren.find(
					(node) => node.title === folderName,
				);

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

	const [treeData, setTreeData] = useState(makeTree(files));

	function handleTreeDataChange(newTreeData: TreeNode[]) {
		setTreeData(newTreeData);
	}

	return (
		<div style={{ height: 400 }}>
			<SortableTree
				treeData={treeData}
				onChange={handleTreeDataChange}
				theme={FileExplorerTheme}
			/>
		</div>
	);
}

export default FileTree;
