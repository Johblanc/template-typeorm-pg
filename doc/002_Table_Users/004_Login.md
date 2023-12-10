# Authentification

Le rôle de cette partie est de récupérer les données d'identification d'un utilisateur, puis de les convertir en une Entity User et un nouveau Token. Les données sont stoquées sont ```requête.user```. Il faudra créer :
* ```AuthService.token()``` pour créer un nouveau token.
* ```AuthService.validateUser()``` pour vérifier les données d'authentification de l'utilisateur.
* ```AuthModule``` pour communiquer avec l'API.
* ```LocalAuthGuard``` et ```LocalStrategy``` pour utiliser l'authentification comme un décorateur dans les controllers.
* Décorateur ```GetUser``` pour récupérer directement l'entity User dans le controller.
* Décorateur ```GetToken``` pour récupérer directement le nouveau Token dans le controller.


## Installations

### nestjs/passport

Pour les guards

```Shell
npm i --save @nestjs/passport passport
```

### nestjs/passport

Pour les tokens

```Shell
npm i --save @nestjs/jwt
```


### passport-local

Pour le logIn

```Shell
npm install passport-local
```

## Environnement 

Dans le ```.env``` :

```
JWTCONSTANTS = 'phraseSecreteDEncodage'
```


## Responser 

Dans le ```src/interceptors/responser.interceptor.ts``` :

Ajouter la propriété ```token``` dans le typage de ```value``` dans le ```map``` et à la suite des ```data``` dans le ```return```.

```ts
/* ... */
export class ResponserInterceptor implements NestInterceptor 
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> 
  {
    /* ... */
    return next
      .handle()
      .pipe(
        map((value? : { message : string, data : any, token : string}) => {
          if (value) {
            /* ... */
            return {
                /* ... */
                data : value.data,
                token : value.token,
            }
          }
          else {
            /* ... */
          }
        }),
      );
  }
}
```

## AuthService

Créer un fichier ```src/auth/auth.service.ts``` :

```ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  token(user: User) {
    const payload = { pseudo: user.pseudo, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(
    pseudo: string,
    password: string,
  ): Promise<(Partial<User> & { token: string }) | null> {
    const user = await User.findOne({
      where: { pseudo },
      select: {
        id: true,
        pseudo: true,
        password: true,
      },
    });
    if (user !== null) {
      const isOk = await bcrypt.compare(password, user.password);

      if (isOk) {
        user.actif_at = new Date().toISOString();
        await user.save();
        const { password, ...result } = {
          ...user,
          token: this.token(user),
        };
        return result;
      }
    }
    return null;
  }
}
```

Utilisation de ```this.jwtService.sign()``` pour créer un Token.

Utilisation de ```bcrypt.compare()``` pour vérififier le mot de passe.

```validateUser()``` met également à jour la dernière activité de l'utilisateur

## Local Guard

### LocalStrategy

Créer un fichier ```src/auth/local_guard/local.strategy.ts``` :

```ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({usernameField: 'pseudo',});
  }

  async validate(pseudo: string, password: string): Promise<(Partial<User> & { token: string }) | null> {

    const user = await this.authService.validateUser(pseudo, password);
    if (!user) {
      throw new UnauthorizedException("Vous n'êtes pas enregisté");
    }
    return user;
  }
}
```

### LocalAuthGuard

Créer un fichier ```src/auth/local_guard/local-auth.guard.ts``` :

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```


## AuthModule

Créer un fichier ```src/auth/auth.module.ts``` :

```ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local_guard/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({ 
  imports: [
    ConfigModule.forRoot(), 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWTCONSTANTS,
      signOptions: { expiresIn: '360000s' },
    })
  ],
  providers: [AuthService , LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

```signOptions: { expiresIn: '360000s' }``` permet de régler la durer de vie du Token.


## Décorateurs

### GetToken

Créer un fichier ```src/auth/get-token.decorator.ts``` :

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetToken = createParamDecorator((_data, ctx: ExecutionContext): string =>
{
    const req = ctx.switchToHttp().getRequest();
    return req.user.token;
});
```

### GetUser

Créer un fichier ```src/auth/get-user.decorator.ts``` :

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User =>
{
    const req = ctx.switchToHttp().getRequest();
    const {token, ...result} = req.user
    return result;
});
```

## Déclaration

Dans ```src/users/users.module.ts```, ajouter ```AuthModule``` dans les ```imports``` :

```ts
import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}
```

## Dans le User Controller

Dans ```src/users/users.cotroller.ts```, ajouter la methode ```login()``` :

```ts
/* ... */
import { Body, ConflictException, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local_guard/local-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { GetToken } from 'src/auth/get-token.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  /* ... */

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User, @GetToken() token : string) {
    return {
      message: 'Vous êtes connecté',
      data: user,
      token: token
    };
  }
}
```


