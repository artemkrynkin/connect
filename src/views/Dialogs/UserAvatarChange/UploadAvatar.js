import React, { useCallback, useRef, useState } from 'react';
import ClassNames from 'classnames';
import { useDropzone } from 'react-dropzone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import styles from './index.module.css';

function UploadAvatar(props) {
	const { setAvatarUploaded, onTryAgain } = props;
	const fileInputFiled = useRef(null);
	const [fileRejection, setFileRejection] = useState(null);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: 'image/png, image/jpeg, image/gif',
		noClick: true,
		onDrop: useCallback(acceptedFiles => {
			if (acceptedFiles && acceptedFiles.length > 0) readFileAndSetAvatarBase64(acceptedFiles[0]);

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []),
		onDropRejected: fileRejections => {
			if (fileRejections[0]?.errors[0]?.code === 'file-invalid-type') {
				setFileRejection({
					code: fileRejections[0]?.errors[0]?.code,
					message: 'Не удалось загрузить фотографию, недопустимый формат файла.',
				});
			} else {
				setFileRejection({
					code: 'unknown-error',
					message: 'Произошла неизвестная ошибка.',
				});
			}
		},
	});

	const onClickUploadPhoto = () => fileInputFiled.current.click();

	const onPickPhoto = event => {
		if (event.target.files && event.target.files.length > 0) {
			return readFileAndSetAvatarBase64(event.currentTarget.files[0]);
		}
	};

	const readFileAndSetAvatarBase64 = file => {
		const Reader = new FileReader();
		Reader.addEventListener('load', () => setAvatarUploaded(Reader.result), false);
		Reader.readAsDataURL(file);
	};

	const onTryAgainPhotoUpload = () => {
		setFileRejection(null);

		onTryAgain();
	};

	return (
		<>
			{!fileRejection ? (
				<>
					<Grid
						{...getRootProps({
							className: ClassNames(styles.dropzonePhoto, {
								[styles.dropzonePhotoActive]: isDragActive,
							}),
							alignItems: 'center',
							justify: 'center',
							direction: 'column',
							container: true,
						})}
					>
						<input {...getInputProps()} />
						<FontAwesomeIcon className={styles.dropzonePhotoIcon} icon={['fad', 'cloud-upload']} />
						<div className={styles.dropzonePhotoText}>
							Перетащите сюда
							<br />
							свою фотографию
						</div>
					</Grid>
					<Typography className={styles.dropzonePhotoUploadOr} variant="caption" align="center" component="div">
						или
					</Typography>
					<Grid alignItems="center" justify="center" direction="column" container>
						<input
							ref={fileInputFiled}
							type="file"
							onChange={onPickPhoto}
							accept="image/png,image/jpeg,image/gif"
							style={{ display: 'none' }}
						/>
						<Button onClick={onClickUploadPhoto} type="button" variant="contained">
							Выберите
						</Button>
					</Grid>
				</>
			) : (
				<Grid className={styles.dropzonePhotoError} justify="center" container>
					<Grid item>
						<FontAwesomeIcon className={styles.dropzoneErrorIcon} icon={['fad', 'exclamation-circle']} />
					</Grid>
					<Grid className={styles.dropzonePhotoErrorContent} item>
						<Typography variant="body1" component="div">
							{fileRejection.message}
						</Typography>
						<Button className={styles.dropzonePhotoTryAgain} onClick={onTryAgainPhotoUpload} type="button" variant="contained" size="small">
							Попробовать еще
						</Button>
					</Grid>
				</Grid>
			)}
		</>
	);
}

export default UploadAvatar;
