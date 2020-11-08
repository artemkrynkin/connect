import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Formik } from 'formik';

import { Dialog, DialogTitle } from 'src/components/Dialog';
import { withCurrentUser } from 'src/components/withCurrentUser';

import { changeUserAvatar } from 'src/actions/user';
import { enqueueSnackbar } from 'src/actions/snackbars';

import AvatarUploadCrop from './AvatarUploadCrop';

function UserAvatarChange(props) {
	const { dialogOpen, onCloseDialog, currentUser } = props;

	const initialValues = {
		file: undefined,
	};

	const onSubmit = (values, actions) => {
		const { onCloseDialog } = props;

		const formData = new FormData();

		formData.append('file', values.file);

		props.changeUserAvatar(formData).then(response => {
			actions.setSubmitting(false);

			if (response.status === 'success') {
				onCloseDialog();
			} else {
				props.enqueueSnackbar({
					message: response.message || 'Неизвестная ошибка.',
					options: {
						variant: 'error',
					},
				});
			}
		});
	};

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} maxWidth="sm">
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				{currentUser.picture ? 'Изменить фото профиля' : 'Добавить фото профиля'}
			</DialogTitle>
			<Formik initialValues={initialValues} validateOnBlur={false} validateOnChange={false} onSubmit={onSubmit}>
				{formikProps => (
					<AvatarUploadCrop enqueueSnackbar={props.enqueueSnackbar} onCloseDialog={onCloseDialog} formikProps={formikProps} />
				)}
			</Formik>
		</Dialog>
	);
}

UserAvatarChange.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
	return {
		changeUserAvatar: data => dispatch(changeUserAvatar({ data })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(UserAvatarChange);
