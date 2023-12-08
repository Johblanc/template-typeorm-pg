# Swagger

## Installation

Pour une documentation rapide de votre API

```Shell
npm i --save @nestjs/swagger
```

## Configurer l'API

Dans ```main.ts``` :

```ts
const config = new DocumentBuilder()
  .setTitle("Nom de l'app")
  .setDescription("Site de la ferme pédagogique AgorAguets")
  .setVersion("1.0")
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```


