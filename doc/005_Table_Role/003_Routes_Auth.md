# Mise à jour de chaque Route

## BearerAuth

Ajouter les 3 BearerAuth à la config de swagger dans ```src/main.ts``` :

```ts
/* ... */
async function bootstrap() {
  /* ... */
  const config = new DocumentBuilder()
    .setTitle('titre API')
    .setDescription('description API')
    .setVersion('1.0')
    .addBearerAuth(undefined,"visitor")
    .addBearerAuth(undefined,"user")
    .addBearerAuth(undefined,"admin")
    .build();
  /* ... */
}
bootstrap();
```

## ExtractorController

Dans le fichier ```src/extractor/extractor.controller.ts```,  pour les deux methodes remplacer ```@UseGuards(UserAuthGuard)``` par ```@ApiBearerAuth("admin")``` et ```@UseGuards(AdminAuthGuard)``` :


```ts
/* ... */
import { AdminAuthGuard } from 'src/auth/admin_guard/admin-auth.guard';

@ApiTags('Setup')
@Controller()
export class ExtractorController {
  /* ... */
  
  @ApiBearerAuth("admin")
  @UseGuards(AdminAuthGuard)
  @Get('extract')
  async extract(@Res() res: Response) {
    /* ... */
  }

  @ApiBearerAuth("admin")
  @UseGuards(AdminAuthGuard)
  @Post('reset')
  @UseInterceptors(ArchiveFileInterceptor)
  async reset(@UploadedFiles() savedFiles: Express.Multer.File[] = []) {
    /* ... */
  }
}
```

Supprimer ```UserAuthGuard``` des impots

## UsersController

Dans le fichier ```src/users/users.controller.ts```

```ts
/* ... */
import { VisitorAuthGuard } from 'src/auth/visitor_guard/visitor-auth.guard';

/* ... */
export class UsersController {
  /* ... */

  @ApiBearerAuth("visitor")
  @ApiBearerAuth("user")
  @ApiBearerAuth("admin")
  @UseGuards(VisitorAuthGuard)
  @UseInterceptors(UserImageFileInterceptor)
  @Patch()
  async update(
    /* ... */
  ) {
    /* ... */
  }

  @ApiBearerAuth("user")
  @ApiBearerAuth("admin")
  @UseGuards(UserAuthGuard)
  @Get(':id')
  async getOne(/* ... */) {
    /* ... */
  }

  @ApiBearerAuth("user")
  @ApiBearerAuth("admin")
  @UseGuards(UserAuthGuard)
  @Get()
  async getMany(@Query() query: GetUsersQueryDto, @GetToken() token: string) {
    /* ... */
}
```



