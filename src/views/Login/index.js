import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Typography from '@material-ui/core/Typography';
import LinkMui from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';

import history from 'src/helpers/history';

import Layout from 'src/components/Layout';

import { checkUsername, login } from 'src/actions/authentication';
import { enqueueSnackbar } from 'src/actions/snackbars';

import LoginForm from './LoginForm';

import stylesLayout from 'src/components/Layout/index.module.css';
import styles from './index.module.css';

const LoginSchema = stepLogin => {
	return Yup.object().shape({
		email: Yup.string()
			.email()
			.required('Обязательное поле'),
		password: Yup.string().when('other', (other, schema) => (stepLogin ? schema.required('Обязательное поле') : schema)),
	});
};

const layoutMetaInfo = {
	pageName: 'login',
	pageTitle: 'Вход',
};

const Login = props => {
	const { location } = props;
	const [stepLogin, setStepLogin] = useState(false);
	const emailFieldRef = useRef(null);
	const passwordFieldRef = useRef(null);

	const searchObj = queryString.parse(location?.search);

	const initialValues = {
		emailOrPassword: '',
		email: searchObj.email || '',
		password: '',
		returnTo: searchObj.returnTo || '',
	};

	const onToggleStepLogin = value => {
		setStepLogin(value);
		setTimeout(() => (value ? passwordFieldRef.current.focus() : emailFieldRef.current.focus()), 0);
	};

	const onSubmit = (values, actions) => {
		history.replace({
			pathname: '/login',
			search: queryString.stringify({
				...queryString.parse(history.location.search),
				email: values.email,
			}),
		});

		if (stepLogin) {
			props.login(values).then(({ status, data }) => {
				actions.setSubmitting(false);

				if (status === 'error' && data?.error === 'access_denied') {
					actions.setErrors({
						emailOrPassword: true,
					});
				}
			});
		} else {
			props.checkUsername(values).then(({ status, data }) => {
				actions.setSubmitting(false);

				if (status === 'success') {
					if (data.action === 'noAction') {
						onToggleStepLogin(true);
					} else {
						history.push({
							pathname: '/signup',
							search: history.location.search,
						});
					}
				} else {
					props.enqueueSnackbar({
						message: data.error_description || 'Неизвестная ошибка.',
						options: {
							variant: 'error',
						},
					});
				}
			});
		}
	};

	useEffect(() => {
		if (searchObj.snackbarMessage && searchObj.snackbarType) {
			props
				.enqueueSnackbar({
					message: searchObj.snackbarMessage || 'Неизвестная ошибка.',
					options: {
						variant: searchObj.snackbarType,
					},
				})
				.then(() => {
					history.replace('/login');
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<div className={styles.container}>
				<Paper className={styles.card}>
					<Typography variant="h6" align="center" gutterBottom>
						Войдите в свой аккаунт
					</Typography>
					<Formik
						initialValues={initialValues}
						validationSchema={LoginSchema(stepLogin)}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={onSubmit}
					>
						{formikProps => (
							<LoginForm
								location={location}
								searchObj={searchObj}
								emailFieldRef={emailFieldRef}
								passwordFieldRef={passwordFieldRef}
								stepLogin={stepLogin}
								onToggleStepLogin={onToggleStepLogin}
								formikProps={formikProps}
							/>
						)}
					</Formik>
					<div className={stylesLayout.infoUnderForm}>
						<LinkMui to={`/password-reset${location.search}`} component={Link}>
							Не помню пароль
						</LinkMui>
					</div>
				</Paper>
				<div className={stylesLayout.infoUnderCard}>
					<div className={stylesLayout.infoUnderCardItem}>
						<LinkMui href="/manifest.json" target="_blank" rel="noreferrer noopener">
							Политика конфиденциальности
						</LinkMui>
					</div>
					<div className={stylesLayout.infoUnderCardItem}>
						<LinkMui href="/manifest.json" target="_blank" rel="noreferrer noopener">
							Условия использования
						</LinkMui>
					</div>
				</div>
			</div>
		</Layout>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		checkUsername: data => dispatch(checkUsername({ data })),
		login: data => dispatch(login({ data })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(Login);
