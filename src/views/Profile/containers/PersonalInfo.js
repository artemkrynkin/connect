import React, { useRef, useState } from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import Avatar from 'src/components/Avatar';
import Dropdown from 'src/components/Dropdown';

import styles from './PersonalInfo.module.css';

const PersonalInfo = props => {
	const { deleteUserAvatar, onOpenDialogByName, currentUser } = props;
	const refDropdownProfile = useRef(null);
	const [dropdownPhotoProfile, setDropdownPhotoProfile] = useState(false);

	const onHandleDropdownPhotoProfile = value =>
		setDropdownPhotoProfile(value === null || value === undefined ? prevValue => !prevValue : value);

	return (
		<div>
			<Grid alignItems="center" direction="column" container>
				<div className={styles.avatarPhoto}>
					<Avatar src={currentUser.picture} size="xl" />
					{currentUser.picture ? (
						<ButtonBase
							ref={refDropdownProfile}
							className={ClassNames(styles.avatarAddButtonIcon, {
								[styles.avatarAddButtonIconActive]: dropdownPhotoProfile,
							})}
							onClick={() => onHandleDropdownPhotoProfile()}
						>
							<FontAwesomeIcon icon={['fas', 'camera']} />
						</ButtonBase>
					) : null}
				</div>
				{!currentUser.picture ? (
					<MuiLink className={styles.avatarAddButton} onClick={() => onOpenDialogByName('userAvatarChange')} component="button">
						Добавить фото
					</MuiLink>
				) : null}
			</Grid>
			<div className={styles.profileDetails}>
				<Typography variant="h4" gutterBottom>
					{currentUser.name}
				</Typography>
				<Typography className={styles.email} variant="caption" component="div" gutterBottom>
					{currentUser.email}
				</Typography>
				<MuiLink onClick={() => onOpenDialogByName('personalInfoEdit')} component="button">
					Изменить личную информацию
				</MuiLink>
			</div>

			<Dropdown
				anchor={refDropdownProfile}
				open={dropdownPhotoProfile}
				onClose={() => onHandleDropdownPhotoProfile(false)}
				placement="bottom"
				style={{ marginTop: -8 }}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							onHandleDropdownPhotoProfile(false);
							onOpenDialogByName('userAvatarChange');
						}}
					>
						{currentUser.picture ? 'Изменить фото' : 'Добавить фото'}
					</MenuItem>
					<MenuItem
						onClick={() => {
							onHandleDropdownPhotoProfile(false);
							deleteUserAvatar();
						}}
					>
						Удалить
					</MenuItem>
				</MenuList>
			</Dropdown>
		</div>
	);
};

export default PersonalInfo;
