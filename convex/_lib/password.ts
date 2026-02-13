// import bcrypt from "bcryptjs";

// const SALT_ROUNDS = 10;

// export async function hashPassword(
//   plainPassword: string
// ): Promise<string> {
//   return await bcrypt.hash(
//     plainPassword,
//     SALT_ROUNDS
//   );
// }

// export async function comparePassword(
//   plainPassword: string,
//   hashedPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(
//     plainPassword,
//     hashedPassword
//   );
// }

// export function validatePasswordStrength(
//   password: string
// ): boolean {
//   const strongRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

//   return strongRegex.test(password);
// }
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export function hashPassword(
  plainPassword: string
): string {
  return bcrypt.hashSync(
    plainPassword,
    SALT_ROUNDS
  );
}

export function comparePassword(
  plainPassword: string,
  hashedPassword: string
): boolean {
  return bcrypt.compareSync(
    plainPassword,
    hashedPassword
  );
}

export function validatePasswordStrength(
  password: string
): boolean {
  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  return strongRegex.test(password);
}
