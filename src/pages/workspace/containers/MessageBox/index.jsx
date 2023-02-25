import React from 'react';
import { DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';

class MessageBox extends React.Component {
	constructor(props) {
		super(props);
		const { userId, message, isWhisper, toUser } = this.props;
	}
	
	render() {
		<div className = "MessageBox">
			{isWhisper ? toUser + ':' + message : message }
		</div>
	}
}

export default MessageBox;