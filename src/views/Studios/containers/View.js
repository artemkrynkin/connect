import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import Members from './Members';

import styles from './View.module.css';

import invoicesEmpty from 'public/img/stubs/invoices_empty.svg';

const View = props => {
	const {
		filterOptions,
		onOpenDialogByName,
		studios: { data: studios },
	} = props;

	if (!studios) return <LoadingPage />;

	if (!studios.paging.total) {
		return (
			<Empty
				classNames={{
					container: styles.empty,
				}}
				imageSrc={invoicesEmpty}
				content={
					<Typography variant="h6" gutterBottom>
						У вас еще нет студий
					</Typography>
				}
				actions={
					<Grid justify="center" alignItems="center" direction="column" container>
						<Typography variant="caption">Дождитесь приглашения или создайте свою</Typography>
						<Button
							onClick={() => onOpenDialogByName('dialogProcurementExpectedCreate')}
							variant="contained"
							color="primary"
							style={{ marginTop: 15 }}
						>
							Создать студию
						</Button>
					</Grid>
				}
			/>
		);
	}

	if (studios && studios.paging.total) {
		return <Members filterOptions={filterOptions} onOpenDialogByName={onOpenDialogByName} studios={props.studios} />;
	}

	return null;
};

export default View;
