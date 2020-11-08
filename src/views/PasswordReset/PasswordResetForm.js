import React from 'react';
import { Field, Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import LinkMui from '@material-ui/core/Link';

import styles from './index.module.css';

const PasswordResetForm = props => {
	const {
		passwordResetEmailSent,
		onTogglePasswordResetEmailSent,
		formikProps: { values, errors, isSubmitting, touched },
	} = props;

	return (
		<Form className={styles.form}>
			{!passwordResetEmailSent ? (
				<>
					<FormControl margin="normal" fullWidth>
						<Field
							name="email"
							label="Мы отправим ссылку для восстановления на адрес"
							placeholder="Введите адрес электронной почты"
							error={Boolean(touched.email && errors.email)}
							helperText={typeof errors.email === 'string' && touched.email && errors.email}
							as={TextField}
							autoComplete="username"
							autoFocus
						/>
					</FormControl>
					<Button type="submit" disabled={isSubmitting} variant="contained" color="primary" fullWidth>
						{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
						<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
							Отправить
						</span>
					</Button>
				</>
			) : (
				<>
					<FontAwesomeIcon className={styles.emailSentIcon} icon={['fad', 'envelope-open-text']} />
					<Typography variant="body1" align="center">
						Мы&nbsp;отправили вам ссылку для восстановления на&nbsp;адрес
					</Typography>
					<Typography variant="subtitle1" align="center" gutterBottom>
						<b>{values.email}</b>
					</Typography>
					<Typography variant="body1" align="center">
						<LinkMui onClick={() => onTogglePasswordResetEmailSent(false)} component="button">
							Отправить ссылку для восстановления повторно
						</LinkMui>
					</Typography>
				</>
			)}
		</Form>
	);
};

export default PasswordResetForm;
