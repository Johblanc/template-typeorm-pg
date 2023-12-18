# Mise à jour d'un utilisateur avec une image

## Expertion interceptor

Dans le fichier ```src/interceptors/responser.exeption.ts``` il faut supprimer les image en cas d'erreur :

```ts
@Catch(HttpException)
export class ResponserExeption implements ExceptionFilter 
{
  catch(exception: HttpException, host: ArgumentsHost) 
  {
    /* ... */ 

    const files = (request.files || []) as Express.Multer.File[]

    if (files.length > 0){
      (files).forEach((file)=> fileRemover(file.path))
    }
    
    if (typeof exept === "object") { /* ... */ }
    else { /* ... */ }
  }
}
```

## Users Services

Dans le fichier ```src/users/users.services.ts``` modifier la methode ```update``` pour ajouter l'image :

```ts
async update(id: string, dto: Partial<User>): Promise<User | null> {
  /* ... */
  if (user) {
    /* ... */
    if (dto.image!== undefined) user.image = dto.image;
    /* ... */
  }
  /* ... */
}
```

## Users Controller

Dans le fichier ```src/users/users.controller.ts``` modifier la methode ```update``` pour ajouter l'image :

```ts
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @UseInterceptors(UserImageFileInterceptor) // Upload du fichier joint dans le dossier "data/img/users/" avec son nom d'origine
  @Patch()
  async update(
    @GetUser() user: User,
    @GetToken() token: string,
    @Body() dto: UpdateUserDto,
    @UploadedFiles() savedFiles: Express.Multer.File[] = [], // Recupération de l'image upload
  ) {
    console.log(savedFiles);

    if (dto.pseudo) {
      const pseudoExist = await this.usersService.findOneByPseudo(dto.pseudo);

      if (pseudoExist && pseudoExist.pseudo !== user.pseudo) {
        throw new ConflictException('Ce Pseudo est déjà enregistré');
      }
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.mail) {
      const mailExist = await this.usersService.findOneByMail(dto.mail);

      if (mailExist && dto.mail !== user.mail) {
        throw new ConflictException('Ce Mail est déjà enregistré');
      }
    }

    return {
      message: 'Profile mis à jour',
      data: await this.usersService.update(user.id, dto),
      token: token,
    };
  }
```