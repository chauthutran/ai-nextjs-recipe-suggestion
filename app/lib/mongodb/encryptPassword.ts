import bcrypt from 'bcryptjs';


const saltRounds = 10; // The higher the salt rounds, the more secure but the slower it is to hash

export const hashPassword = async (plainTextPassword: string): Promise<string> => {
	try {
		const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
		return hashedPassword;
	} catch (err) {
		console.error('Error hashing password:', err);
		throw err;
	}
}

export const comparePassword = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
	try {
		const match = await bcrypt.compare(plainTextPassword, hashedPassword);
		return match;
	} catch (err) {
		console.error('Error comparing passwords:', err);
		//   throw err;
	}
	return false;
}
