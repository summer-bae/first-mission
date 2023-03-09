import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Workspace from '../../pages/workspace';
import Chat from '../../pages/workspace/Chat/Chat';

const App = props => (
	<Switch>
		<Route exact path={['/', '/workspace']} render={() => <Workspace {...props} />} />
		<Route exact path={'/chat'} render={() => <Chat {...props} />} />
	</Switch>
);
export default App;