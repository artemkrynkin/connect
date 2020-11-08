import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button/Button';
import Tooltip from '@material-ui/core/Tooltip';

import { ReactComponent as GoogleLogo } from 'public/img/other/google_logo.svg';
import { ReactComponent as VkLogo } from 'public/img/other/vk_logo.svg';
import styles from './index.module.css';

const SocialAuth = () => (
	<>
		<Typography className={styles.or} align="center" variant="caption" component="div">
			или
		</Typography>
		<Tooltip
			title={
				<div style={{ textAlign: 'center' }}>
					Вход через сторонние сервисы на данный момент недоступен.
					<br />
					Используйте адрес электронной почты для входа.
				</div>
			}
			placement="top"
		>
			<Grid className={styles.actionButtons}>
				<Button variant="outlined" startIcon={<GoogleLogo className={styles.googleLogo} />} fullWidth disabled>
					Войти с помощью Google
				</Button>
				<Button
					variant="outlined"
					startIcon={<FontAwesomeIcon className={styles.yandexLogo} icon={['fab', 'yandex']} />}
					fullWidth
					disabled
				>
					Войти с помощью Яндекс
				</Button>
				<Button
					variant="outlined"
					startIcon={<FontAwesomeIcon className={styles.facebookLogo} icon={['fab', 'facebook']} />}
					fullWidth
					disabled
				>
					Войти с помощью Facebook
				</Button>
				<Button variant="outlined" startIcon={<VkLogo className={styles.vkLogo} />} fullWidth disabled>
					Войти с помощью ВКонтакте
				</Button>
			</Grid>
		</Tooltip>
	</>
);

export default SocialAuth;
