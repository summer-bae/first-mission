import bcrypt from 'bcrypt';
const saltRounds = 10;

export const genHashedPw = async (rawPw: string | Buffer) => {
	const hashedPw = await bcrypt.hash(rawPw, saltRounds);
	return hashedPw;
};

export const isEqualPw = async (rawPw: string | Buffer, hashedPw: string) => {
	const isEqual = await bcrypt.compare(rawPw, hashedPw);
	return isEqual;
};