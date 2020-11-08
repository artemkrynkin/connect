import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import queryString from 'query-string';
import * as Yup from 'yup';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinkMui from '@material-ui/core/Link';

import history from 'src/helpers/history';
import { CLIENT_URL } from 'src/api/constants';

import Layout from 'src/components/Layout';

import { signup, login } from 'src/actions/authentication';

import SignupForm from './SignupForm';
import { passwordPolicy } from './passwordPolicy';

import stylesLayout from 'src/components/Layout/index.module.css';
import styles from './index.module.css';

const layoutMetaInfo = {
	pageName: 'signup',
	pageTitle: 'Регистрация',
};

const SignupSchema = Yup.object().shape({
	email: Yup.string()
		.email('Некорректный Email')
		.required('Обязательное поле'),
	name: Yup.string().required('Обязательное поле'),
	password: Yup.string()
		.min(passwordPolicy.low.explain()[0].format[0], true)
		.required(true),
});

const Signup = props => {
	const { location } = props;

	const searchObj = queryString.parse(location?.search);

	const initialValues = {
		email: searchObj.email || '',
		name: '',
		password: '',
		eulaAccepted: true,
	};

	const onSubmit = async (values, actions) => {
		const signupResponse = await props.signup(values);

		actions.setSubmitting(false);

		if (signupResponse.data?.action === 'login') {
			return history.push({
				pathname: '/login',
				search: queryString.stringify({
					email: values.email,
					infoCode: signupResponse.data.infoCode,
				}),
			});
		}

		const loginResponse = await props.login({ ...values, returnTo: `${CLIENT_URL}/profile` });

		if (loginResponse.status === 'error') {
			props.enqueueSnackbar({
				message: loginResponse.data.error_description || 'Неизвестная ошибка.',
				options: {
					variant: 'error',
				},
			});
		}
	};

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<div className={styles.container}>
				<Paper className={styles.card}>
					<Typography variant="h6" align="center" gutterBottom>
						Регистрация аккаунта
					</Typography>
					<Formik
						initialValues={initialValues}
						validationSchema={SignupSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={onSubmit}
					>
						{formikProps => <SignupForm searchObj={searchObj} formikProps={formikProps} />}
					</Formik>
					<div className={stylesLayout.infoUnderForm}>
						<Typography>
							Уже есть аккаунт KeeberInk?{' '}
							<LinkMui to={`/login${location?.search || ''}`} component={Link}>
								<b>Войти</b>
							</LinkMui>
						</Typography>
					</div>
				</Paper>
				<div className={stylesLayout.infoUnderCard}>
					<div className={stylesLayout.infoUnderCardItem}>
						Эта страница защищена reCAPTCHA, при этом применяются
						<br />
						<LinkMui href="/manifest.json" target="_blank" rel="noreferrer noopener">
							Политика конфиденциальности
						</LinkMui>{' '}
						и{' '}
						<LinkMui href="/manifest.json" target="_blank" rel="noreferrer noopener">
							Условия использования Google
						</LinkMui>
					</div>
				</div>
			</div>
		</Layout>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		signup: data => dispatch(signup({ data })),
		login: data => dispatch(login({ data })),
	};
};

export default connect(null, mapDispatchToProps)(Signup);
