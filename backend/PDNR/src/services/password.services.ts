import * as bcrypt from 'bcrypt';

export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(password);

  return password.length >= minLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
};

export const sanitizeInput = (input: string): string => input.replace(/['"]/g, '');

export const encryptPassword = async (password: string): Promise<string> => {
  if (!validatePassword(password)) {
    throw new Error('A jelszó nem felel meg a követelményeknek (Kis és nagybetű, Min. 8 karakter, Speciális karakter, Szám).');
  }

  const sanitizedPassword = sanitizeInput(password);

  try {
    const hash = await bcrypt.hash(sanitizedPassword, 12);
    console.log('hashed pw: ' + hash);
    return hash;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
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
