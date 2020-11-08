import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { LoadingPage } from 'src/components/Loading';

const AuthViewHandler = props => {
	const { children, user, loading } = props;

	if (user) return children(true);
	if (loading) return <LoadingPage style={{ minHeight: '100vh' }} />;
	return children(false);
};

export default compose(connect(), withRouter)(AuthViewHandler);
