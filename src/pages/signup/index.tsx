import React, { useState } from 'react';
import { Input, FormText } from 'reactstrap';
import axios from 'axios';

import DefaultUserInfoInputGroup from '../../components/DefaultUserInfoInputGroup';
import CenterLayout from 'components/CenterLayout';
import AccountButtonGroup from 'components/AccountButtonGroup';

import style from './style.scss';

function getErrorMsg(errCode) {
	let errorMsg;
	switch (errCode) {
		case 400:
			errorMsg = '잘못된 요청입니다.';
			break;
		case 419:
			errorMsg = '이미 존재하는 아이디입니다.';
			break;
		default:
			errorMsg = '잠시 후 다시 시도해주시기랍니다.';
			break;
	}
	return errorMsg;
}

function Signup() {
	const [id, setId] = useState<string>('');
	const [pw, setPw] = useState<string>('');
	const [repw, setRepw] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');

	function onChangeId(e) {
		setId(e.currentTarget.value);
	}

	function onChangePw(e) {
		setPw(e.currentTarget.value);
	}

	function onChangeRePw(e) {
		setRepw(e.currentTarget.value);
	}

	function signUp() {
		if (pw === repw) {
			axios
				.post('/api/account/signup', {
					id,
					pw,
				})
				.then(({ data }) => {
					window.location.href = '/signin';
				})
				.catch((err) => {
					setErrorMsg(getErrorMsg(err.response.status));
				});
		} else {
			setErrorMsg('비밀번호와 비밀번호 확인이 같지 않습니다.');
		}
	}

	return (
		<CenterLayout>
			<div className={style.Signup}>
				<DefaultUserInfoInputGroup
					onChangeId={onChangeId}
					onChangePw={onChangePw}
					id={id}
					pw={pw}
				/>
				<Input
					type="password"
					onChange={onChangeRePw}
					placeholder="비밀번호 확인"
					value={repw}
				/>
				{errorMsg && <FormText>{errorMsg}</FormText>}
				<AccountButtonGroup
					buttonLabel="회원가입"
					onClickButton={signUp}
					linkLabel="로그인"
					linkTo="/signin"
				/>
			</div>
		</CenterLayout>
	);
}

export default Signup;