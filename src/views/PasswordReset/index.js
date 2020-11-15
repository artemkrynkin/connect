import React, { useState } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinkMui from '@material-ui/core/Link';

import Layout from 'src/components/Layout';

import { resetPassword } from 'src/actions/authentication';
import { enqueueSnackbar } from 'src/actions/snackbars';

import PasswordResetForm from './PasswordResetForm';

import stylesLayout from 'src/components/Layout/index.module.css';
import styles from './index.module.css';
import { Link } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
	email: Yup.string().required('Обязательное поле'),
});

const layoutMetaInfo = {
	pageName: 'password-reset',
	pageTitle: 'Сброс пароля',
};

const PasswordReset = props => {
	const { location } = props;
	const [passwordResetEmailSent, setPasswordResetEmailSent] = useState(false);

	const searchObj = queryString.parse(location?.search);

	const initialValues = {
		email: searchObj.email || '',
	};

	const onTogglePasswordResetEmailSent = value => setPasswordResetEmailSent(value);

	const onSubmit = (values, actions) => {
		props.resetPassword(values).then(({ status, data }) => {
			actions.setSubmitting(false);

			if (status === 'success') {
				onTogglePasswordResetEmailSent(true);
			} else {
				actions.setErrors({
					email: true,
					password: true,
				});

				props.enqueueSnackbar({
					message: data.error_description || 'Неизвестная ошибка.',
					options: {
						variant: 'error',
					},
				});
			}
		});
	};

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<div className={styles.container}>
				<Paper className={styles.card}>
					<Typography variant="h6" align="center">
						Не удается войти в аккаунт?
					</Typography>
					<Formik
						initialValues={initialValues}
						validationSchema={LoginSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={onSubmit}
					>
						{formikProps => (
							<PasswordResetForm
								passwordResetEmailSent={passwordResetEmailSent}
								onTogglePasswordResetEmailSent={onTogglePasswordResetEmailSent}
								formikProps={formikProps}
							/>
						)}
					</Formik>
					<div className={stylesLayout.infoUnderForm}>
						<LinkMui to={`/login${location?.search || ''}`} component={Link}>
							Вернуться ко входу в аккаунт
						</LinkMui>
					</div>
				</Paper>
				<div className={stylesLayout.infoUnderCard}>
					<div className={stylesLayout.infoUnderCardItem}>
						<LinkMui href="/manifest.json" target="_blank" rel="noreferrer noopener">
							Помощь по входу
						</LinkMui>
					</div>
					<div className={stylesLayout.infoUnderCardItem}>
						<LinkMui href="/manifest.json" target="_blank" rel="noreferrer noopener">
							Служба поддержки
						</LinkMui>
					</div>
				</div>
			</div>
		</Layout>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		resetPassword: data => dispatch(resetPassword({ data })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(PasswordReset);
