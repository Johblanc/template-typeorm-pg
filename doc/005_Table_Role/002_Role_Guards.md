# Role Guards

## User Guard

### Auth Guard

Le fichier ```src/auth/user_guard/user-auth.guard.ts``` reste inchangé.

### Strategy

Modifier le fichier ```src/auth/user_guard/user.strategy.ts``` pour ajouter le controle du role :

```ts
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
    if (!user.role || user.role.acces_level < 1){
      throw new UnauthorizedException("Vous n'avez pas le niveau d'acces requis")
    }
    return user;
  }
}
```

## Visitor Guard

### Auth Guard

Créer un fichier ```src/auth/visitor_guard/visitor-auth.guard.ts``` :

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class VisitorAuthGuard extends AuthGuard('visitor') { }
```

### Strategy

Créer un fichier ```src/auth/visitor_guard/visitor.strategy.ts``` :

```ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VisitorStrategy extends PassportStrategy(Strategy, "visitor") {
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
```

## Admin Guard

### Auth Guard

Créer un fichier ```src/auth/admin_guard/admin-auth.guard.ts``` :

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('admin') {}
```

### Strategy

Créer un fichier ```src/auth/admin_guard/admin.strategy.ts``` :

```ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, "admin") {
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
    if (!user.role || user.role.acces_level < 2){
      throw new UnauthorizedException("Vous n'avez pas le niveau d'acces requis")
    }
    return user;
  }
}
```

## Déclaration

Dans le fichier ```src\auth\auth.module.ts``` ajouter ```VisitorStrategy``` et ```AdminStrategy``` aux providers :

```ts
/* ... */
import { UserStrategy } from './user_guard/user.strategy';
import { VisitorStrategy } from './visitor_guard/visitor.strategy';
import { AdminStrategy } from './admin_guard/admin.strategy';

@Module({ 
  /* ... */
  providers: [
    AuthService,
    LocalStrategy,
    VisitorStrategy,
    UserStrategy,
    AdminStrategy,
  ],
  /* ... */
})
export class AuthModule {}
```




