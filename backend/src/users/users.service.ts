import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (userExists) {
      throw new BadRequestException('E-mail ou Username já estão em uso no jogo.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
