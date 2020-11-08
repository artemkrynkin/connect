import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { getMyAccount, getCurrentMember } from 'src/actions/user';
import { getStudios } from 'src/actions/studios';

const CurrentUserComponent = props => {
	const {
		user: { data: currentUser, isFetching: isLoadingCurrentUser, error: errorCurrentUser },
		children,
		render,
	} = props;

	if (!children && !render) return null;

	if (!window.__DATA__) {
		if (!currentUser && !isLoadingCurrentUser && !errorCurrentUser) {
			props.getMyAccount();
		}
	}

	return children ? children({ currentUser, isLoadingCurrentUser }) : render({ currentUser, isLoadingCurrentUser });
};

const mapStateToProps = state => {
	return {
		user: state.user,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getMyAccount: () => dispatch(getMyAccount()),
		getStudios: () => dispatch(getStudios()),
		getCurrentMember: () => dispatch(getCurrentMember()),
	};
};

export const CurrentUser = compose(connect(mapStateToProps, mapDispatchToProps))(CurrentUserComponent);

export const withCurrentUser = Component => {
	const C = props => {
		const { wrappedComponentRef, ...remainingProps } = props;
		return (
			<CurrentUser>
				{({ currentUser, isLoadingCurrentUser }) => {
					return (
						<Component
							{...remainingProps}
							currentUser={currentUser || null}
							isLoadingCurrentUser={isLoadingCurrentUser}
							ref={wrappedComponentRef}
						/>
					);
				}}
			</CurrentUser>
		);
	};

	C.WrappedComponent = Component;
	return hoistNonReactStatics(C, Component);
};
