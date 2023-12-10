import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, "user") {
  constructor(private readonly authService : AuthService) {
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTCONSTANTS,
    });
  }

  async validate(payload: any) : Promise<(Partial<User> & { token: string }) | null>{
    
    const user = await this.authService.findOneByToken(payload)
    if (user === null ){
      throw new UnauthorizedException("Vous n'êtes pas enregistré")
    }
    return user;
  }
}