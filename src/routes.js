import React from 'react';
import { compose } from 'redux';
import { Route, Switch, Redirect } from 'react-router';
import { SnackbarProvider } from 'notistack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeProvider } from '@material-ui/core/styles';

import generateMetaInfo from 'shared/generate-meta-info';

import { CLIENT_URL } from 'src/api/constants';

import { MuiTheme } from 'src/helpers/MuiTheme';
import useStylesSnackbar from 'src/helpers/snackbarStyles';
import signedOutFallback from 'src/helpers/signed-out-fallback';

import Head from 'src/components/head';
import Snackbar from 'src/components/Snackbar';
import { withCurrentUser } from 'src/components/withCurrentUser';

import Signup from 'src/views/Signup';
import Login from 'src/views/Login';
import PasswordReset from 'src/views/PasswordReset';
import Profile from 'src/views/Profile';
// import Studios from 'src/views/Studios';
import PageNotFound from 'src/views/PageNotFound';

import AuthViewHandler from './components/authViewHandler';

const LoginFallback = signedOutFallback(() => <Redirect to="/profile" />, Login);

const SignupFallback = signedOutFallback(() => <Redirect to="/profile" />, Signup);

const PasswordResetFallback = signedOutFallback(() => <Redirect to="/profile" />, PasswordReset);

const ProfileFallback = signedOutFallback(Profile, () => (
	<Redirect to={{ pathname: '/login', search: `?returnTo=${CLIENT_URL}/profile` }} />
));

// const StudiosFallback = signedOutFallback(Studios, () => (
// 	<Redirect to={{ pathname: '/login', search: `?returnTo=${CLIENT_URL}/studios` }} />
// ));

const snackbarSettings = {
	maxSnack: 5,
	anchorOrigin: {
		vertical: 'bottom',
		horizontal: 'left',
	},
	preventDuplicate: true,
	autoHideDuration: 7000,
	iconVariant: {
		success: <FontAwesomeIcon icon={['fal', 'check-circle']} />,
		error: <FontAwesomeIcon icon={['fal', 'times-circle']} />,
		warning: <FontAwesomeIcon icon={['fal', 'exclamation-circle']} />,
		info: <FontAwesomeIcon icon={['fal', 'exclamation-circle']} />,
	},
};

const Routes = props => {
	const { currentUser, isLoadingCurrentUser } = props;
	const { title, description } = generateMetaInfo();
	const classesSnackbar = useStylesSnackbar();

	return (
		<ThemeProvider theme={MuiTheme}>
			<SnackbarProvider
				classes={{
					message: classesSnackbar.message,
					variantSuccess: classesSnackbar.success,
					variantError: classesSnackbar.error,
					variantWarning: classesSnackbar.warning,
					variantInfo: classesSnackbar.info,
				}}
				{...snackbarSettings}
			>
				{/* Метатеги по умолчанию, переопределяемые чем-нибудь вниз по дереву */}
				<Head title={title} description={description} />

				<Snackbar />

				{/*
         AuthViewHandler частно возвращает null, но отвечает за запуск таких вещей как
         создание студии когда пользователь авторизовался, но не привязан ни к одной студии
         */}
				<AuthViewHandler user={currentUser} loading={isLoadingCurrentUser}>
					{() => null}
				</AuthViewHandler>

				<>
					{/*
           Switch отображает только первое совпадение. Внутренняя маршрутизация происходит вниз по течению
           https://reacttraining.com/react-router/web/api/Switch
           */}
					<Switch>
						{/* Публичные бизнес страницы */}
						{/* Страницы приложения */}
						<Route path="/" exact>
							{() => {
								if (currentUser) return <Redirect to="/profile" push />;
								else return <Redirect to="/login" push />;
							}}
						</Route>

						<Route path="/login" component={LoginFallback} />
						<Route path="/signup" component={SignupFallback} />
						<Route path="/password-reset" component={PasswordResetFallback} />

						<Route path="/profile" component={ProfileFallback} />
						{/*<Route path="/studios" component={StudiosFallback} />*/}

						<Route path="*" component={PageNotFound} />
					</Switch>
				</>
			</SnackbarProvider>
		</ThemeProvider>
	);
};

export default compose(withCurrentUser)(Routes);
