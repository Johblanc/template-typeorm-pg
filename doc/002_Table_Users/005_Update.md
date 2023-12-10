# Mise à jour d'un Utilisateur

## Installation

### passport-jwt

Pour la vérification des droits

```Shell
npm install passport-jwt
```

### TypeScript

```Shell
npm install --save @types/passport-local
```

```Shell
npm install --save @types/passport-jwt
```

## AuthService

Créer un fichier ```src/auth/auth.service.ts```, ajouter la methode :

```ts
async findOneByToken(token: {
  pseudo: string;
  sub: string;
  iat: number;
}): Promise<(Partial<User> & { token: string }) | null> {
  const user = await User.findOne({where :{ pseudo: token.pseudo, id: token.sub },select:{
    id: true,
    pseudo: true,
    first_name: true,
    last_name: true,
    creat_at: true,
    actif_at: true,
    mail: true
  }});
  

  if (user !== null) {
    user.actif_at = new Date().toISOString();
    await user.save();
    return {
      ...user,
      token: this.token(user),
    };
  }

  return null;
}
```

## User Guard

### UserStrategy

Créer un fichier ```src/auth/user_guard/user.strategy.ts``` :

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
    return user;
  }
}
```

### UserAuthGuard

Créer un fichier ```src/auth/user_guard/user-auth.guard.ts``` :

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserAuthGuard extends AuthGuard('user') { }
```

### Declaration

Dans le fichier ```src/auth/auth.module.ts```, ajouter ```UserStrategy``` dans les ```providers``` :

```ts
/* ... */
import { UserStrategy } from './user_guard/user.strategy';

@Module({ 
  /* ... */
  providers: [AuthService , LocalStrategy, UserStrategy],
  /* ... */
})
export class AuthModule {}
```


## Validators

### IsPseudoOptional

Créer un fichier ```src/validators/IsPseudoOptional.ts```:

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPseudoOptional', async: false })
export class IsPseudoOptional implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) : boolean {
    return value === undefined || typeof value === "string" && value.length > 4;
  }

  defaultMessage(args: ValidationArguments) : string {
    return (
      `${args.property} doit être du texte d'au moins 5 charactères`
    );
  }
}
```

### IsPassOptional

Créer un fichier ```src/validators/IsPassOptional.ts```:

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPassOptional', async: false })
export class IsPassOptional implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return value === undefined || typeof value === "string" && Boolean(
      value.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    );
  }

  defaultMessage(args: ValidationArguments) {
    return (
      `${args.property} doit contenir au moins 8 caractères dont une minuscule,` +
      ` une majuscule, un chiffre et un symbole parmi : @ $ ! % * ? &.`
    )
  }
}
```

### IsStringTypeOptional

Créer un fichier ```src/validators/IsStringTypeOptional.ts```:

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStringTypeOptional', async: false })
export class IsStringTypeOptional implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return value === undefined || typeof value === "string" 
  }

  defaultMessage(args: ValidationArguments) {
    return (
      `${args.property} doit être du texte`
    )
  }
}
```

### IsMailOptional

Créer un fichier ```src/validators/IsMailOptional.ts```:

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsMailOptional', async: false })
export class IsMailOptional implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return value === undefined || typeof value === "string" && Boolean(
      value.match(
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
      ),
    );
  }

  defaultMessage(args: ValidationArguments) {
    return (
      `${args.property} doit être un e-mail`
    )
  }
}
```

## DTO

Créer un fichier ```src/users/dto/update-user.dto.ts```:

```ts
import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { IsMailOptional } from "src/validators/IsMailOptional";
import { IsPassOptional } from "src/validators/IsPassOptional";
import { IsPseudoOptional } from "src/validators/IsPseudoOptional";
import { IsStringTypeOptional } from "src/validators/IsStringTypeOptional";

export class UpdateUserDto {

  @ApiProperty()
  @Validate(IsPseudoOptional)
  pseudo?: string ;

  @ApiProperty()
  @Validate(IsPassOptional)
  password?: string ;
  
  @ApiProperty()
  @Validate(IsStringTypeOptional)
  first_name?: string ;

  @ApiProperty()
  @Validate(IsStringTypeOptional)
  last_name?: string ;
  
  @ApiProperty()
  @Validate(IsMailOptional)
  mail?: string ;
}
```

## UsersService

Dans le fichier ```src/users/users.service.ts```, ajouter les methodes :

```ts
async findOneByMail(mail: string): Promise<User | null> {
  return await User.findOneBy({ mail });
}

async update(id: string, dto: Partial<User>): Promise<User | null> {
  const user = await User.findOneBy({id})
  if (user){
    if (dto.pseudo) user.pseudo = dto.pseudo ;
    if (dto.password) user.password = dto.password ;
    if (dto.mail) user.mail = dto.mail ;
    if (dto.first_name) user.first_name = dto.first_name ;
    if (dto.last_name) user.last_name = dto.last_name ;
    await user.save();
  }
  return user
}
```

## UsersController

Dans le fichier ```src/users/users.controller.ts```, ajouter la methode :

```ts
/* ... */
import { UserAuthGuard } from 'src/auth/user_guard/user-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  /* ... */

  @ApiBearerAuth('user')
  @UseGuards(UserAuthGuard)
  @Patch()
  async update(@GetUser() user: User, @GetToken() token : string, @Body() dto: UpdateUserDto) {
    if (dto.pseudo) {
      const pseudoExist = await this.usersService.findOneByPseudo(dto.pseudo);

      if (pseudoExist && pseudoExist.pseudo !== user.pseudo) {
        throw new ConflictException('Ce Pseudo est déjà enregistré');
      }
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.mail){
      const mailExist = await this.usersService.findOneByMail(dto.mail);
      
      if (mailExist && dto.mail !== user.mail) {
        throw new ConflictException("Ce Mail est déjà enregistré");
      }
    }
    return {
      message: 'Profile mis à jour',
      data:  await this.usersService.update(
        user.id,
        dto,
      ),
      token: token,
    };
  }
  /* ... */
}
```




