import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ClassNames from 'classnames';

import { withCurrentUser } from 'src/components/withCurrentUser';

import Layout from 'src/components/Layout';
import { checkQueryInFilter, deleteParamsCoincidence } from 'src/components/Pagination/utils';

import { getStudios } from 'src/actions/studios';

import Index from './containers/index';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const layoutMetaInfo = {
	pageName: 'studios',
};

function Studios(props) {
	const { studios } = props;

	const filterOptions = {
		params: checkQueryInFilter({
			name: '',
			role: 'all',
		}),
		delete: {
			searchByName: ['page', 'limit'],
			searchByValue: [null, '', 'all'],
			serverQueryByValue: [null, '', 'all'],
		},
	};

	useEffect(() => {
		const { params: filterParams, delete: filterDeleteParams } = filterOptions;

		const query = deleteParamsCoincidence({ ...filterParams }, { type: 'server', ...filterDeleteParams });

		props.getStudios(query, { emptyData: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<div className={ClassNames(styles.container, stylesPage.pageContent)}>
				<Index studios={studios} filterOptions={filterOptions} {...props} />
			</div>
		</Layout>
	);
}

const mapStateToProps = state => {
	return {
		studios: state.studios,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getStudios: (query, options) => dispatch(getStudios({ query, ...options })),
	};
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withCurrentUser)(Studios);
