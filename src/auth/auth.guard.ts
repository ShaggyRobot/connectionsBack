import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { JsonWebTokenError, JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader)
        throw new HttpException(
          {
            type: 'InvalidTokenException',
            message:
              'Header should contain "Authorization" parameter with Valid Bearer code.',
          },
          HttpStatus.BAD_REQUEST,
        );

      const headerUid = req.headers['rs-uid'];
      const headerEmail = req.headers['rs-email'];

      if (!headerUid || !headerEmail) {
        throw new HttpException(
          {
            type: 'InvalidUserDataException',
            message:
              'Header should contain "rs-uid", "rs-email" and "Authorization" parameters.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_bearer, token] = authHeader.split(' ');
      const { sessionId, userId } = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (
        !user ||
        user.email !== headerEmail.toLowerCase() ||
        user.id !== +headerUid
      ) {
        throw new HttpException(
          {
            type: 'InvalidIDException',
            message: 'User was not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.sessionId !== sessionId) throw new JsonWebTokenError('');

      return true;
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        throw new HttpException(
          {
            type: 'InvalidTokenException',
            message: 'Current session token is not valid.',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw e;
    }
  }
}
