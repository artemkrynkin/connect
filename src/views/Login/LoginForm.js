import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import { Field, Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';

import SocialAuth from 'src/components/SocialAuth';

import styles from './index.module.css';

const LoginForm = props => {
	const {
		location,
		searchObj,
		emailFieldRef,
		passwordFieldRef,
		stepLogin,
		onToggleStepLogin,
		formikProps: { errors, isSubmitting, touched, setFieldValue },
	} = props;
	const [visiblePassword, setVisiblePassword] = useState(false);

	const onToggleVisiblePassword = () => {
		setVisiblePassword(value => !value);

		setTimeout(() => {
			passwordFieldRef.current.focus();
			passwordFieldRef.current.selectionStart = passwordFieldRef.current.value.length;
		}, 0);
	};

	const onChangeEmail = () => {
		if (!stepLogin) return;

		onToggleStepLogin(false);
		setFieldValue('password', '');
	};

	return (
		<Form className={styles.form}>
			{searchObj.infoCode === 'existingUser' ? (
				<Typography className={styles.infoAboveForm} align="center" gutterBottom>
					Похоже, вы уже регистрировали аккаунт с использованием этого адреса электронной почты.
					<br />
					Войдите в систему или выполните сброс пароля, если вы его забыли.
				</Typography>
			) : null}
			{stepLogin && errors.emailOrPassword ? (
				<Typography className={styles.infoAboveForm} align="center" color="error" gutterBottom>
					Неверный адрес электронной почты и/или пароль.
				</Typography>
			) : null}
			<FormControl margin="normal" fullWidth>
				<Field
					inputRef={emailFieldRef}
					className={ClassNames({ [styles.emailField]: stepLogin })}
					type="email"
					name="email"
					placeholder="Введите адрес электронной почты"
					error={Boolean((touched.email && errors.email) || errors.emailOrPassword)}
					helperText={typeof errors.email === 'string' && touched.email && errors.email}
					as={TextField}
					InputProps={{
						endAdornment: stepLogin ? (
							<InputAdornment position="end">
								<FontAwesomeIcon icon={['fas', 'pen']} />
							</InputAdornment>
						) : null,
						onClick: () => onChangeEmail(),
					}}
					disabled={stepLogin}
					autoComplete="username"
					autoFocus
				/>
			</FormControl>
			<Collapse in={stepLogin} timeout="auto">
				<FormControl margin="normal" fullWidth>
					<Field
						inputRef={passwordFieldRef}
						name="password"
						type={visiblePassword ? 'text' : 'password'}
						placeholder="Введите пароль"
						error={Boolean((touched.password && errors.password) || errors.emailOrPassword)}
						helperText={typeof errors.password === 'string' && touched.password && errors.password}
						as={TextField}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<ButtonBase className={styles.toggleVisiblePassword} onClick={() => onToggleVisiblePassword()}>
										<FontAwesomeIcon icon={['fas', visiblePassword ? 'eye-slash' : 'eye']} fixedWidth />
									</ButtonBase>
								</InputAdornment>
							),
						}}
					/>
				</FormControl>
			</Collapse>
			<Grid className={styles.actionButtons}>
				<Button type="submit" disabled={isSubmitting} variant="contained" color="primary" fullWidth>
					{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
					<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
						{stepLogin ? 'Войти' : 'Продолжить'}
					</span>
				</Button>
				<Button to={`/signup${location?.search || ''}`} disabled={isSubmitting} variant="outlined" component={Link} fullWidth>
					Зарегистрироваться
				</Button>
			</Grid>
			<SocialAuth />
		</Form>
	);
};

export default LoginForm;
