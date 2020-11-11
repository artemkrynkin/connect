import React from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

import Layout from 'src/components/Layout';

import { deleteUserAvatar } from 'src/actions/user';

import Index from './containers/index';

const layoutMetaInfo = {
	pageName: 'profile',
};

function Profile(props) {
	return (
		<Layout metaInfo={layoutMetaInfo}>
			<div className={ClassNames(styles.container, stylesPage.pageContent)}>
				<Index {...props} />
			</div>
		</Layout>
	);
}

const mapDispatchToProps = dispatch => {
	return {
		deleteUserAvatar: () => dispatch(deleteUserAvatar()),
	};
};

export default connect(null, mapDispatchToProps)(Profile);
