import React, { useState } from 'react';
import axios from 'axios';

import style from './file.module.css';

import JSZip from 'jszip';

// textarea 수정 해보기
function File(this: any) {
	const [uploadFile, setUploadFile] = useState<any>('');
	const [fileList, setFileList] = useState<any>([]);
	const [selectFile, setSelectFile] = useState<string>('');
	const [contents, setContents] = useState<string>('편집할 파일을 선택해주세요');

	function handlerFileUpload(e) {
		const fileInfo = e.target.files[0];
		const fileName = fileInfo.name.substr(fileInfo.name.length - 3);

		if (['zip', 'tar'].includes(fileName)) {
			setUploadFile(fileInfo);
			setSelectFile('');
		} else {
			e.target.value = '';
			alert('.zip, .tar 확장자만 업로드 할 수 있습니다');
		}
	}

	function getFileList(e) {
		const file = uploadFile;
		const reader = new FileReader();

		if (file.name.substr(file.name.length - 3) === 'zip') {
			reader.onload = (e) => {
				if (e && e.target && e.target.result) {
					JSZip.loadAsync(e.target.result).then((obj) => {
						setFileList(Object.values(obj.files));
					});
				}

			};

			reader.onerror = (e) => {
				alert('file open error');
			};

			reader.readAsArrayBuffer(file);
		} else {
		}
	}

	function handlerFileSubmit(e) {
		if (!uploadFile) {
			alert('파일을 선택해주세요');
			return;
		}

		const formData = new FormData();
		formData.append('file', uploadFile);

		axios.post('api/file/upload', formData).then(({ data }) => {
			if (data) {
				getFileList(e);
			}
		});
	}

	function handlerFileClick(value) {
		setSelectFile(value);

		axios
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
			axios
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
			return (
				<li
					className={style.select}
					onClick={item.dir ? handlerDirClick : handlerFileClick.bind(this, item.name)}
				>
					{item.name}
				</li>
			);
		} else {
			return (
				<li
					className={style.noselect}
					onClick={item.dir ? handlerDirClick : handlerFileClick.bind(this, item.name)}
				>
					{item.name}
				</li>
			);
		}
	});

	return (
		<div className={style.file_wrapper}>
			<div className={style.file_upload}>
				<input type="file" name="file" id={style.w} onChange={handlerFileUpload} />
				<button type="button" className="btn btn-link" onClick={handlerFileSubmit}>
					업로드
				</button>
			</div>
			<div className={style.file_list}>
				<ul>{fileListComponent ? fileListComponent : '업로드를 해주세요'}</ul>
			</div>
			<div className={style.file_textEdit}>
				<textarea
					rows={10}
					cols={60}
					value={contents}
					onChange={handlerChangeContents}
				/>
				<button className="btn btn-primary" onClick={handlerSaveContents}>
					저장
				</button>
			</div>
		</div>
	);
	// }
}

export default File;