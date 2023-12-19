# Route pour l'autopromotion d'un utilisateur

## Environnement

Dans le fichier ```.env``` ajouter la variable :

```env
ADMIN_WORD = 'mot de passe pour se promouvoir au role admin'
```

## Validator

Créer un fichier ```src/validators/IsPromoteWord.ts``` :

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPromoteWord', async: false })
export class IsPromoteWord implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) : boolean {
    return value !== undefined && value === process.env.ADMIN_WORD ;
  }

  defaultMessage(args: ValidationArguments) : string {
    return (
      `${args.property} est incorrecte`
    );
  }
}
```

## DTO

Créer un fichier ```src/roles/dto/promote-to-admin.dto.ts``` :

```ts
import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { IsPromoteWord } from "src/validators/IsPromoteWord";

export class PromoteToAdminDto {

  @ApiProperty()
  @Validate(IsPromoteWord)
  promote_word : string
}
```

## RolesService

Créer un fichier ```src/roles/roles.service.ts``` :

```ts
import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  async promoteToAdmin(userId: string) {
    const roles = await Role.find();
    const user = await User.findOneBy({ id: userId });
    if (user !== null){
      user.sub_roles = roles;
      await user.save();
    }
    return user
  }
}
```

## RolesController

Créer un fichier ```src/roles/roles.controller.ts``` :

```ts
import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { GetToken } from 'src/auth/get-token.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { VisitorAuthGuard } from 'src/auth/visitor_guard/visitor-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { PromoteToAdminDto } from './dto/promote-to-admin.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiBearerAuth('visitor')
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @UseGuards(VisitorAuthGuard)
  @Patch('promote-to-admin')
  async promoteToAdmin(@GetUser() user: User, @GetToken() token: string, @Body() _ : PromoteToAdminDto) {

    const promoteUser = await this.rolesService.promoteToAdmin(user.id)
    
    return {
      message: 'Promotion au role admin',
      data: promoteUser,
      token: token,
    };
  }
}
```

## RolesModule

Créer un fichier ```src/roles/roles.module.ts``` :

```ts
import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [],
})
export class RolesModule {}
```

## Déclaration

Dans le fichier ```src/app.module.ts``` ajouter ```RolesModule``` aux imports :

```ts
/* ... */
import { RolesModule } from './roles/roles.module';

@Module({
  /* ... */
  imports: [
    /* ... */
    RolesModule,
  ],
})
export class AppModule {}
```
