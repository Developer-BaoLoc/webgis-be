import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./modules/users/entities/user.entity";
import * as bcrypt from "bcrypt";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo = app.get(getRepositoryToken(User));

  const users = [
    {
      email: "admin@webgis.com",
      password: "admin123",
      role: "admin",
    },
    {
      email: "user1@webgis.com",
      password: "user123",
      role: "user",
    },
  ];

  for (const u of users) {
    const exists = await userRepo.findOneBy({ email: u.email });

    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);

      await userRepo.save({
        email: u.email,
        password: hashed,
        role: u.role,
      });

      console.log("Created:", u.email);
    } else {
      console.log("Exists:", u.email);
    }
  }

  await app.close();
}

bootstrap();