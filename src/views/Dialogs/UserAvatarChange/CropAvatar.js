import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';

import styles from './index.module.css';

function CropAvatar(props) {
	const { isSubmitting, avatarUploaded, setCropperCroppedAreaPixels, onTryAgain } = props;
	const [cropperCrop, setCropperCrop] = useState({ x: 0, y: 0 });
	const [cropperZoom, setCropperZoom] = useState(1);

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCropperCroppedAreaPixels(croppedAreaPixels);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onCloseCropper = () => {
		setCropperCrop({ x: 0, y: 0 });
		setCropperZoom(1);

		onTryAgain();
	};

	return (
		<Grid className={styles.cropperContainer}>
			<div className={styles.cropperMarkup}>
				<IconButton className={styles.cropperReset} onClick={onCloseCropper} disabled={isSubmitting} size="small">
					<FontAwesomeIcon icon={['fal', 'times']} />
				</IconButton>
				<Cropper
					image={avatarUploaded}
					crop={cropperCrop}
					zoom={cropperZoom}
					aspect={1}
					onCropChange={coords => setCropperCrop(coords)}
					onCropComplete={onCropComplete}
					onZoomChange={setCropperZoom}
					zoomWithScroll={false}
				/>
			</div>
			<FormControl className={styles.cropperZoomSlider} fullWidth>
				<Slider
					value={cropperZoom}
					onChange={(event, value) => setCropperZoom(value)}
					step={0.05}
					min={1}
					max={3}
					valueLabelDisplay="off"
					disabled={isSubmitting}
				/>
				<Grid justify="space-between" container>
					<FontAwesomeIcon className={styles.cropperZoomSliderIconSmall} icon={['fas', 'user-circle']} />
					<FontAwesomeIcon className={styles.cropperZoomSliderIconLarge} icon={['fas', 'user-circle']} />
				</Grid>
			</FormControl>
		</Grid>
	);
}

export default CropAvatar;
