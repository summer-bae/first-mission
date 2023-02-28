import React from 'react';

import Header from './containers/Header';
import File from './containers/file/File';

const Workspace = () => (
	<div>
		<Header />
		<div>Workspace</div>
		<div>
			<div>file</div>
			<div>chat</div>
		</div>

		<File />
	</div>
);

export default Workspace;