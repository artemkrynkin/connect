import React, { Fragment } from 'react';

import PersonalInfo from './PersonalInfo';

function View(props) {
	const { deleteUserAvatar, onOpenDialogByName, currentUser } = props;

	return (
		<Fragment>
			<PersonalInfo deleteUserAvatar={deleteUserAvatar} onOpenDialogByName={onOpenDialogByName} currentUser={currentUser} />
		</Fragment>
	);
}

export default View;
