# Promouvoir un utilisateur

## Validator

Créer un fichier ```src/validators/IsRoles.ts``` :

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsRoles', async: false })
export class IsRoles implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return (
      typeof value === 'string' && ['visitor', 'user', 'admin'].includes(value)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} doit contenir être un liste de roles : visitor, user et admin`;
  }
}
```

## DTO

Créer un fichier ```src/roles/dto/promote-user.dto.ts``` :

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, Validate } from 'class-validator';
import { IsRoles } from 'src/validators/IsRoles';

export class PromoteDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsArray()
  @Validate(IsRoles,{each : true})
  sub_roles: string[];
}
```

## RolesService

Dans le fichier ```src/roles/roles.service.ts``` ajouter la methode ```promote``` :

```ts
async promote(userId: string, sub_roles: string[]) {
  const roles = await Role.find({
    where: sub_roles.map((item) => {
      return { name: item };
    }),
  });
  const user = await User.findOneBy({ id: userId });
  if (user !== null) {
    user.sub_roles = roles;
    await user.save();
  }
  return user;
}
```

## UsersModule

Dans le fichier ```src/users/users.module.ts``` ajouter ```UsersService``` aux exports :

```ts
/* ... */

@Module({
  /* ... */
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## RolesModule

Dans le fichier ```src/roles/roles.module.ts``` ajouter ```UsersModule``` aux imports :

```ts
/* ... */
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  /* ... */
})
export class RolesModule {}
```

## RolesController

Dans le fichier ```src/roles/roles.controller.ts``` ajouter ```usersService``` au constructor et la methode ```promote``` :

```ts
import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
/* ... */
import { AdminAuthGuard } from 'src/auth/admin_guard/admin-auth.guard';
import { PromoteDto } from './dto/promote-user.dto';
import { UsersService } from 'src/users/users.service';

/* ... */
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}
  /* ... */

  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @Patch()
  async promote(@GetToken() token: string, @Body() dto: PromoteDto) {
    const userExist = await this.usersService.findOneById(dto.user_id);
    if (userExist === null) {
      throw new NotFoundException("Cette utilisateur n'existe pas");
    }

    const promoteUser = await this.rolesService.promote(
      dto.user_id,
      dto.sub_roles,
    );

    return {
      message: "Promotion d'un utilisateur",
      data: promoteUser,
      token: token,
    };
  }
}

```



