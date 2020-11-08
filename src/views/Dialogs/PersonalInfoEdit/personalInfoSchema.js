import * as Yup from 'yup';

const personalInfoSchema = Yup.object().shape({
	name: Yup.string().required(),
});

export default personalInfoSchema;
