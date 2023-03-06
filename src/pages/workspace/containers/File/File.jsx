import React from 'react';
import axios from 'axios';

import style from './file.css';

const JSZip = require('jszip');

export default class File extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			uploadFile: '',
			fileList: [],
			selectFile: '',
			contents: '편집할 파일을 선택해주세요',
		};
	}

	handlerFileUpload = (e) => {
		const fileInfo = e.target.files[0];
		const fileName = fileInfo.name.substr(fileInfo.name.length - 3);

		if (['zip', 'tar'].includes(fileName)) {
			this.setState({
				uploadFile: fileInfo,
				selectFile: '',
			});
		} else {
			e.target.value = '';
			alert('.zip, .tar 확장자만 업로드 할 수 있습니다');
		}
	};

	getFileList = (e) => {
		const file = this.state.uploadFile;
		const reader = new FileReader();

		if (file.name.substr(file.name.length - 3) === 'zip') {
			reader.onload = (e) => {
				JSZip.loadAsync(e.target.result).then((obj) => {
					this.setState({
						fileList: Object.values(obj.files),
					});
				});
			};

			reader.onerror = (e) => {
				alert('file open error');
			};

			reader.readAsArrayBuffer(file);
		} else {
		}
	};

	handlerFileSubmit = (e) => {
		if (!this.state.uploadFile) {
			alert('파일을 선택해주세요');
			return;
		}

		const formData = new FormData();
		formData.append('file', this.state.uploadFile);

		axios.post('api/file/upload', formData).then(({ data }) => {
			if (data) {
				this.getFileList(e);
			}
		});
	};

	handlerFileClick = (value) => {
		this.setState({
			selectFile: value,
		});

		axios
			.get('api/file/contents', {
				params: { filename: value },
			})
			.then(({ data }) => {
				this.setState({
					contents: data,
				});
			});
	};

	handlerChangeContents = (e) => {
		this.setState({
			contents: e.target.value,
		});
	};

	handlerSaveContents = (e) => {
		if (this.state.selectFile) {
			axios
				.post('api/file/contents', {
					filename: this.state.selectFile,
					contents: this.state.contents,
				})
				.then(() => {
					alert('저장하였습니다');
					this.setState({
						uploadFile: '',
						contents: '편집할 파일을 선택해주세요',
						selectFile: '',
					});
				});
		}
	};

	handlerDirClick = (e) => {
		alert('폴더는 편집할 수 없습니다');
	};

	render() {
		let rootFileName = this.state.uploadFile.name;
		if (rootFileName) {
			rootFileName = rootFileName.substr(0, rootFileName.length - 4) + '/';
		}

		const fileList = this.state.fileList.map((item, idx) => {
			if (this.state.selectFile === item.name) {
				return (
					<li
						className={style.select}
						onClick={
							item.dir
								? this.handlerDirClick
								: this.handlerFileClick.bind(this, item.name)
						}
					>
						{item.name}
					</li>
				);
			} else {
				return (
					<li
						className={style.noselect}
						onClick={
							item.dir
								? this.handlerDirClick
								: this.handlerFileClick.bind(this, item.name)
						}
					>
						{item.name}
					</li>
				);
			}
		});

		return (
			<div className={style.file_wrapper}>
				<div className={style.file_upload}>
					<input type="file" name="file" id={style.w} onChange={this.handlerFileUpload} />
					<button
						type="button"
						className="btn btn-link"
						onClick={this.handlerFileSubmit}
					>
						업로드
					</button>
				</div>
				<div className={style.file_list}>
					<ul>{fileList ? fileList : '업로드를 해주세요'}</ul>
				</div>
				<div className={style.file_textEdit}>
					<textarea
						rows="10"
						cols="60"
						value={this.state.contents}
						onChange={this.handlerChangeContents}
					/>
					<button className="btn btn-primary" onClick={this.handlerSaveContents}>
						저장
					</button>
				</div>
			</div>
		);
	}
}