import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 5;

export const hashPassword = async (password: string): Promise<string> => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Failed to hash password");
    }
}
