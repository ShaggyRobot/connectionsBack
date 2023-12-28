import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';

import { InvalidFormDataException } from 'src/users/exceptions/invalidFormData.exception';
import { PrimaryDuplicationException } from 'src/users/exceptions/primaryDuplication.exception';

import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany();

    const usersMapped = users.map((user) => ({
      name: {
        S: user.name,
      },
      uid: {
        S: user.id.toString(),
      },
    }));

    return {
      Count: users.length,
      Items: usersMapped,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    if (!name || !email || !password) {
      throw new InvalidFormDataException();
    }

    const passwordHash = await bcrypt.hash(password, +process.env.SALT_ROUNDS);
    const sessionId = crypto.randomUUID();
    const userData = {
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      sessionId,
    };

    try {
      return await this.prisma.user.create({ data: userData });
    } catch (e) {
      if (e.code === 'P2002' && e.meta && e.meta.target.includes('email')) {
        throw new PrimaryDuplicationException(email);
      }
    }
  }

  async getProfile(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user)
      throw new HttpException(
        {
          type: 'InvalidIDException',
          message: 'User was not found',
        },
        HttpStatus.BAD_REQUEST,
      );

    const userDto = {
      email: {
        S: user.email,
      },
      name: {
        S: user.name,
      },
      uid: {
        S: user.id.toString(10),
      },
      createdAt: {
        S: new Date(user.createdAt).getTime().toString(),
      },
    };

    return userDto;
  }

  async updateProfile(id: number, name: string) {
    const user = this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user)
      throw new HttpException(
        {
          type: 'InvalidIDException',
          message: 'User was not found. Check passed identificators.',
        },
        HttpStatus.BAD_REQUEST,
      );

    return await this.prisma.user.update({
      where: { id },
      data: {
        name,
      },
    });
  }
}
