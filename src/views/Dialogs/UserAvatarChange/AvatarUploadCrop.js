import React, { useState } from 'react';
import { Form } from 'formik';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import UploadAvatar from './UploadAvatar';
import CropAvatar from './CropAvatar';
import getCroppedImg from './cropImage';

function AvatarUploadCrop(props) {
	const {
		onCloseDialog,
		formikProps: { submitForm, isSubmitting, setFieldValue },
	} = props;
	const [avatarUploaded, setAvatarUploaded] = useState(null);
	const [cropperCroppedAreaPixels, setCropperCroppedAreaPixels] = useState(null);

	const onTryAgain = () => {
		setAvatarUploaded(null);
		setFieldValue('file', undefined);
		setCropperCroppedAreaPixels(null);
	};

	const onDownload = async () => {
		try {
			const croppedImage = await getCroppedImg(avatarUploaded, cropperCroppedAreaPixels);

			const file = new File([croppedImage.blob], 'avatar.jpg', {
				type: 'image/jpeg',
				lastModified: Date.now(),
			});

			setFieldValue('file', file);
			submitForm();
		} catch (error) {
			props.enqueueSnackbar({
				message: 'Неизвестная ошибка.',
				options: {
					variant: 'error',
				},
			});
			console.error(error);
		}
	};

	return (
		<>
			<DialogContent>
				<Form>
					{avatarUploaded ? (
						<CropAvatar
							isSubmitting={isSubmitting}
							avatarUploaded={avatarUploaded}
							setCropperCroppedAreaPixels={setCropperCroppedAreaPixels}
							onTryAgain={onTryAgain}
						/>
					) : (
						<UploadAvatar setAvatarUploaded={setAvatarUploaded} onTryAgain={onTryAgain} />
					)}
				</Form>
			</DialogContent>
			<DialogActions>
				<Grid spacing={2} container>
					<Grid xs={4} item>
						<Button onClick={onCloseDialog} variant="outlined" size="large" fullWidth>
							Отмена
						</Button>
					</Grid>
					<Grid xs={8} item>
						<Button
							onClick={onDownload}
							variant="contained"
							color="primary"
							size="large"
							disabled={isSubmitting || !avatarUploaded}
							fullWidth
						>
							{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
							<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
								Загрузить
							</span>
						</Button>
					</Grid>
				</Grid>
			</DialogActions>
		</>
	);
}

export default AvatarUploadCrop;
