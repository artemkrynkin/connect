import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import LinkMui from '@material-ui/core/Link';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';
import HelpPanel from '../HelpPanel';
import Sidebar from '../Sidebar';

const Layout = props => {
	const { children, metaInfo, currentUser } = props;
	const { title: pageTitle, description: pageDescription } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	return (
		<div className={stylesPage.pageWrapper}>
			<Head title={pageTitle} description={pageDescription} />
			{currentUser ? (
				<>
					<HelpPanel currentUser={currentUser} />
					<Sidebar />
					<div className={ClassNames(stylesPage.page)}>{children}</div>
				</>
			) : (
				<div className={ClassNames(stylesPage.page, styles.unauthorizedContainer)}>
					<div className={styles.unauthorizedContainerCenter}>
						<Link className={styles.logo} to="/" />
						{children}
					</div>
					<div className={styles.copyright}>
						&copy; {new Date().getFullYear()}, <LinkMui href="https://keeberink.com">KeeberInk</LinkMui>
					</div>
				</div>
			)}
		</div>
	);
};

Layout.propTypes = {
	children: PropTypes.node,
	metaInfo: PropTypes.shape({
		pageName: PropTypes.string,
		pageTitle: PropTypes.string,
	}),
};

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
	};
};

export default connect(mapStateToProps, null)(Layout);
