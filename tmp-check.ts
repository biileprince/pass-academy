import bcrypt from 'bcryptjs';
import { db } from './lib/db';

async function main() {
  const user = await db.user.findUnique({ where: { email: 'student@pasacademy.com' } });
  if (!user) {
    console.log(JSON.stringify({ found: false }));
    return;
  }

  const passwordOk = await bcrypt.compare('Student@1234', user.password ?? '');
  console.log(JSON.stringify({
    found: true,
    email: user.email,
    role: user.role,
    passwordLength: user.password?.length ?? 0,
    passwordPrefix: user.password?.slice(0, 20) ?? null,
    passwordOk,
  }));
}

main().finally(() => db.$disconnect());
