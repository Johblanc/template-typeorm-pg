import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local_guard/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserStrategy } from './user_guard/user.strategy';

@Module({ 
  imports: [
    ConfigModule.forRoot(), 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWTCONSTANTS,
      signOptions: { expiresIn: '360000s' },
    })
  ],
  providers: [AuthService , LocalStrategy, UserStrategy],
  exports: [AuthService],
})
export class AuthModule {}
