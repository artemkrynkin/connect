import React from 'react';
import { NavLink } from 'react-router-dom';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.module.css';

const routes = [
	{
		path: '/profile',
		name: 'Профиль',
		icon: null,
	},
	// {
	// 	path: '/studios',
	// 	name: 'Студии',
	// 	icon: null,
	// },
	// {
	// 	path: '/subscriptions',
	// 	name: 'Подписки',
	// 	icon: null,
	// }
];

const Sidebar = () => (
	<div className={styles.container}>
		<div className={styles.wrapper}>
			<div className={styles.logo}>KeeberInk Аккаунт</div>
			<div className={styles.menu}>
				{routes.length &&
					routes.map((route, index) => (
						<NavLink key={index} className={styles.menuLink} activeClassName={styles.menuLink_active} to={route.path}>
							{route.icon}
							<span className={styles.menuText}>{route.name}</span>
						</NavLink>
					))}
			</div>
		</div>
	</div>
);

export default Sidebar;
