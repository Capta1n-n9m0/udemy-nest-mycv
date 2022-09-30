import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _script } from "crypto";
import { promisify } from "util";

const script = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {
  }

  async signup(email: string, password: string) {
    // if email in user
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException("email in use");
    }

    //hash pass
    const salt = randomBytes(8).toString("hex");
    const hash = (await script(password, salt, 32)) as Buffer;
    const result = salt + "." + hash.toString("hex");

    //create user
    const user = await this.userService.create(email, result);

    //return user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    const [salt, storedHash] = user.password.split(".");

    const hash = (await script(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString("hex")) {
      throw new BadRequestException("bad password");
    }

    return user;
  }
}