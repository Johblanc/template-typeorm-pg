# Correctif Param Validator

Dans le fichier ```src/users/users.controller.ts``` modifier la methode ```getOne``` :

```ts
/* ... */
import {
  /* ... */
  ParseUUIDPipe,
  /* ... */
} from '@nestjs/common';
/* ... */

/* ... */
export class UsersController {
  /* ... */

  @ApiBearerAuth('visitor')
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @UseGuards(VisitorAuthGuard)
  @Get(':uuid')                                                     // <-- uuid
  async getOne(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,               // <-- uuid
    @GetUser() user: User,
    @GetToken() token: string,
  ) {

    const targetUser = await this.usersService.findOneById(uuid);   // <-- uuid
    /* ... */
  }
  /* ... */
}
```





