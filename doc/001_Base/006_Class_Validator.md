# Class-validator

## Installation Complémentaire


Permet la manipulation et la vérification des éléments entrant et sortant de l'API

```Shell
npm i --save class-validator class-transformer
```


## ValidationPipe

Permet d'utiliser les decorateurs de validation des dto et des parametres de la requête

Dans ```main.ts``` :

```ts
app.useGlobalPipes(new ValidationPipe());
```


## Class_Serializer

Permet d'utiliser certains decorateurs pour vos entités. (```@Exclde()``` par exemple)

Dans ```main.ts``` :

```ts
app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
```
