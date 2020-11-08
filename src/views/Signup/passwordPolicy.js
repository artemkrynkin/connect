import PasswordSheriff from 'password-sheriff';

const upperCase = PasswordSheriff.charsets.upperCase;
const lowerCase = PasswordSheriff.charsets.lowerCase;
const numbers = PasswordSheriff.charsets.numbers;
const specialCharacters = PasswordSheriff.charsets.specialCharacters;

const none = new PasswordSheriff.PasswordPolicy({
	length: { minLength: 1 },
});

const low = new PasswordSheriff.PasswordPolicy({
	length: { minLength: 6 },
});

const fair = new PasswordSheriff.PasswordPolicy({
	length: { minLength: 6 },
	containsAtLeast: {
		atLeast: 2,
		expressions: [upperCase, lowerCase, numbers, specialCharacters],
	},
});

const good = new PasswordSheriff.PasswordPolicy({
	length: { minLength: 8 },
	containsAtLeast: {
		atLeast: 3,
		expressions: [lowerCase, upperCase, numbers, specialCharacters],
	},
});

const excellent = new PasswordSheriff.PasswordPolicy({
	length: { minLength: 10 },
	containsAtLeast: {
		atLeast: 3,
		expressions: [lowerCase, upperCase, numbers, specialCharacters],
	},
	identicalChars: { max: 2 },
});

export const passwordPolicy = {
	none,
	low,
	fair,
	good,
	excellent,
};

export const passwordStrengthCheck = password => {
	if (passwordPolicy.excellent.check(password)) return 'excellent';
	else if (passwordPolicy.good.check(password)) return 'good';
	else if (passwordPolicy.fair.check(password)) return 'fair';
	else if (passwordPolicy.low.check(password)) return 'low';
	else if (passwordPolicy.none.check(password)) return 'none';
};
