import React from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import style from './style.module.scss';

type AccountButtonProps = {
	buttonLabel: string;
	linkLabel: string;
	linkTo: string;
	onClickButton: () => void; // 아무것도 리턴하지 않는 함수
};

const AccountButtonGroup = ({
	buttonLabel,
	onClickButton,
	linkLabel,
	linkTo,
}: AccountButtonProps) => (
	<React.Fragment>
		<div className={style.AccountButtonGroup__btn_wrapper}>
			<Button
				color="primary"
				onClick={onClickButton}
				className={style.AccountButtonGroup__btn}
			>
				{buttonLabel}
			</Button>
		</div>
		<div className={style.AccountButtonGroup__link_wrapper}>
			<Link to={linkTo}>{linkLabel}</Link>
		</div>
	</React.Fragment>
);

export default AccountButtonGroup;