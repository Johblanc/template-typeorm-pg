# Correctif Swagger

Ajouter ```@ApiTags('Images')``` en decorateur de la class ```ImagesController``` dans le fichier ```src/images/images.controller.ts``` :

```ts
/* ... */
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Images')
@Controller('img')
export class ImagesController {
  /* ... */
}

```