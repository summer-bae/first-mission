import React from 'react';

import style from './style.module.scss';

const CenterLayout = ({ children }) => (
	<div className={style.CenterLayout_wrapper}>
		<div className={style.CenterLayout}>
			{children}
		</div>
	</div>
);

export default CenterLayout;