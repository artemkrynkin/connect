import authRoutes from './auth';
import userAccount from './userAccount';
import studios from './studios';
import members from './members';

const router = app => {
	app.use('/auth', authRoutes);
	app.use('/api', userAccount);
	app.use('/api', studios);
	app.use('/api', members);
};

export default router;
