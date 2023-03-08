import React, { useState } from 'react';
import axios from 'axios';
import { FormText } from 'reactstrap';

import DefaultUserInfoInputGroup from 'components/DefaultUserInfoInputGroup';
import CenterLayout from 'components/CenterLayout';
import AccountButtonGroup from 'components/AccountButtonGroup';

import style from './style.scss';

function getErrorMsg(errCode) {
	let errorMsg;
	switch (errCode) {
		case 400:
			errorMsg = '잘못된 요청입니다.';
			break;
		case 420:
			errorMsg = '잘못된 아이디나 패스워드입니다.';
			break;
		default:
			errorMsg = '잠시 후 다시 시도해주시기랍니다.';
			break;
	}
	return errorMsg;
}

function Signin() {
	const [id, setId] = useState<string>('');
	const [pw, setPw] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');

	function onChangeId(e) {
		setId(e.currentTarget.value);
	}

	function onChangePw(e) {
		setPw(e.currentTarget.value);
	}

	function signIn() {
		axios
			.post('/api/account/signin', { id, pw })
			.then(({ data }) => {
				window.location.href = '/';
			})
			.catch((err) => {
				setErrorMsg(getErrorMsg(err.response.status));
			});
	}

	return (
		<CenterLayout>
			<div className={style.Signin}>
				<DefaultUserInfoInputGroup
					onChangeId={onChangeId}
					onChangePw={onChangePw}
					id={id}
					pw={pw}
				/>
				{errorMsg && <FormText>{errorMsg}</FormText>}
				<AccountButtonGroup
					buttonLabel="로그인"
					onClickButton={signIn}
					linkLabel="회원가입"
					linkTo="/signup"
				/>
			</div>
		</CenterLayout>
	);
}

export default Signin;