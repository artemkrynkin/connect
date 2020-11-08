import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import ProfileSettings from './ProfileSettings';

import styles from '../index.module.css';

const Index = () => {
	return (
		<Container maxWidth="lg">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid className={styles.content} item xs={12}>
					<ProfileSettings />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;