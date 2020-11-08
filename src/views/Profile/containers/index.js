import React, { useState, lazy, Suspense } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogPersonalInfoEdit = lazy(() => import('src/views/Dialogs/PersonalInfoEdit'));

const DialogUserAvatarChange = lazy(() => import('src/views/Dialogs/UserAvatarChange'));

const Index = props => {
	// const { currentStudio, getMember } = props;
	const [dialogData, setDialogData] = useState({});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		personalInfoEdit: false,
		userAvatarChange: false,
	});

	const onOpenDialogByName = (dialogName, dataType, data) => {
		setDialogOpenedName(dialogName);

		setDialogs({
			...dialogs,
			[dialogName]: true,
		});

		if (dataType && data) {
			setDialogData({
				...dialogData,
				[dataType]: data,
			});
		}
	};

	const onCloseDialogByName = dialogName => {
		setDialogs({
			...dialogs,
			[dialogName]: false,
		});
	};

	const onExitedDialogByName = dataType => {
		setDialogOpenedName('');

		if (dataType) {
			setDialogData({
				...dialogData,
				[dataType]: null,
			});
		}
	};

	return (
		<Container>
			<View onOpenDialogByName={onOpenDialogByName} {...props} />

			<Suspense fallback={null}>
				<DialogPersonalInfoEdit dialogOpen={dialogs.personalInfoEdit} onCloseDialog={() => onCloseDialogByName('personalInfoEdit')} />

				<DialogUserAvatarChange dialogOpen={dialogs.userAvatarChange} onCloseDialog={() => onCloseDialogByName('userAvatarChange')} />
			</Suspense>
		</Container>
	);
};

export default Index;
