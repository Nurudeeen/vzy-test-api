import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        req.user = decoded;
        return true;
      } catch (error) {
        throw new UnauthorizedException('token expired, please log in');
      }
    }
    throw new UnauthorizedException('token not provided');
  }
}
