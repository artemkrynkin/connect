import React, { useState, useEffect, useRef } from 'react';
import { Field, Form } from 'formik';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import LinkMui from '@material-ui/core/Link';
import InputAdornment from '@material-ui/core/InputAdornment';
import ButtonBase from '@material-ui/core/ButtonBase';

import { capitalize } from 'src/helpers/utils';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import SocialAuth from 'src/components/SocialAuth';

import { passwordPolicy, passwordStrengthCheck } from './passwordPolicy';

import styles from './index.module.css';

const SignupForm = props => {
	const {
		searchObj,
		formikProps: { values, errors, isSubmitting, touched },
	} = props;
	const passwordFieldRef = useRef(null);
	const [passwordStrength, setPasswordStrength] = useState('');
	const [visiblePassword, setVisiblePassword] = useState(false);

	const onToggleVisiblePassword = () => {
		setVisiblePassword(value => !value);

		setTimeout(() => {
			passwordFieldRef.current.focus();
			passwordFieldRef.current.selectionStart = passwordFieldRef.current.value.length;
		}, 0);
	};

	useEffect(() => {
		setPasswordStrength(passwordStrengthCheck(values.password) || '');
	}, [values.password]);

	return (
		<Form className={styles.form}>
			<FormControl margin="normal" fullWidth>
				<Field
					name="email"
					placeholder="Введите адрес электронной почты"
					error={Boolean(touched.email && errors.email)}
					helperText={typeof errors.email === 'string' && touched.email && errors.email}
					as={TextField}
					autoComplete="username"
					autoFocus={Boolean(!searchObj.email)}
				/>
			</FormControl>
			<FormControl margin="normal" fullWidth>
				<Field
					name="name"
					placeholder="Введите полное имя"
					error={Boolean(touched.name && errors.name)}
					helperText={typeof errors.name === 'string' && touched.name && errors.name}
					as={TextField}
					autoComplete="name"
					autoFocus={Boolean(searchObj.email)}
				/>
			</FormControl>
			<FormControl margin="normal" fullWidth>
				<Field
					inputRef={passwordFieldRef}
					name="password"
					type={visiblePassword ? 'text' : 'password'}
					placeholder="Придумайте пароль"
					error={Boolean(touched.password && errors.password)}
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
					autoComplete="off"
				/>
				<div
					className={ClassNames(styles.passwordStrengthIndicator, {
						[styles[`passwordStrength${capitalize(passwordStrength)}`]]: values.password !== '',
					})}
				>
					<div className={styles.passwordStrengthIndicatorDivision1} />
					<div className={styles.passwordStrengthIndicatorDivision2} />
					<div className={styles.passwordStrengthIndicatorDivision3} />
					<div className={styles.passwordStrengthIndicatorDivision4} />
					<div className={styles.passwordStrengthIndicatorDivision5} />
				</div>
				<Typography className={styles.passwordStrengthText} variant="caption" align="center" component="div">
					{/^(excellent)$/.test(passwordStrength) ? (
						<>Очень надёжный пароль</>
					) : /^(good)$/.test(passwordStrength) ? (
						<>Надёжный пароль</>
					) : /^(fair)$/.test(passwordStrength) ? (
						<>Пароль легко подобрать</>
					) : /^(low)$/.test(passwordStrength) ? (
						<>Пароль слишком простой</>
					) : /^(none)$/.test(passwordStrength) ? (
						<>Длина пароля должна быть не менее {passwordPolicy.low.explain()[0].format[0]} символов</>
					) : (
						<>&nbsp;</>
					)}
				</Typography>
			</FormControl>

			<Button type="submit" disabled={isSubmitting || !values.eulaAccepted} variant="contained" color="primary" fullWidth>
				{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
				<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
					Зарегистрироваться
				</span>
			</Button>

			<div className={styles.containerEula}>
				<Typography variant="caption" className={styles.eulaText} gutterBottom>
					Нажимая кнопку «Зарегистрироваться»:
				</Typography>
				<Field
					type="checkbox"
					name="eulaAccepted"
					Label={{
						label: (
							<span className={styles.eulaText}>
								Я&nbsp;принимаю{' '}
								<LinkMui href="/manifest.json" target="_blank" rel="noreferrer noopener">
									Условия использования
								</LinkMui>
								&nbsp;и даю своё согласие на&nbsp;обработку моей персональной информации на&nbsp;условиях, определенных{' '}
								<LinkMui href="/manifest.json" target="_blank" rel="noreferrer noopener">
									Политикой конфиденциальности
								</LinkMui>{' '}
								KeeberInk.
							</span>
						),
					}}
					as={CheckboxWithLabel}
					disabled={isSubmitting}
				/>
			</div>
			<SocialAuth />
		</Form>
	);
};

export default SignupForm;
