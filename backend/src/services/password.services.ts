import * as bcrypt from 'bcrypt';

const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
};

const sanitizeInput = (input: string): string => input.replace(/['"]/g, '');

export const encryptPassword = async (password: string): Promise<string> => {
  if (!validatePassword(password)) {
    throw new Error('Password does not meet complexity requirements.');
  }

  const sanitizedPassword = sanitizeInput(password);

  try {
    const hash = await bcrypt.hash(sanitizedPassword, 12);
    console.log('hashed pw: ' + hash);
    return hash;
  } catch (err) {
    throw new Error(err);
  }
};

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    const result = await bcrypt.compare(password, hash);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}
