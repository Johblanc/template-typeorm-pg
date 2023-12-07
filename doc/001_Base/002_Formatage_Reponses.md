# Formatage des reponses de l'API

## Responser Interceptor

Permet de formater le body des reponses de l'API lorsque la demande à aboutie et génére un log dans la console

```ts
{
  statusCode : context.getArgs()[1].statusCode, /* La valeur du code du status */
  timestamp: new Date().toISOString(),          /* La date et l'heure de la reponse */
  path: context.getArgs()[0].url,               /* URL de la demande */
  message : value.message,                      /* Message d'erreur */
  data : value.data,                            /* Données de la réponse */
}
```
### Utilisation

#### Création du fichier

Dans votre dossier "src" créez un dossier "interceptors" puis un fichier "responser.interceptor.ts" 

Placez à l'interieur le code suivant

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * Permet de récupérer l'enssemble des Requetes issues du front, de les chronométrer puis de les formater avant de les renvoyer.
 *
 * @return .statusCode  : Valeur du Code Status de la responce
 * @return .timestamp   : Moment de la Réponce
 * @return .path        : Route utilisée pour aboutir à cette Réponce
 * @return .message     : Information sur la Réponce
 * @return .data        : Les Données demandées
 */
@Injectable()
export class ResponserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      map((value?: { message: string; data: any }) => {
        if (value) {
          console.log(
            `${context.getArgs()[0].method} | ${
              context.getArgs()[1].statusCode
            } | ${context.getArgs()[0].url}\nDelais : ${Date.now() - now}ms\n${
              value.message
            }`
          );
          return {
            statusCode: context.getArgs()[1].statusCode,
            timestamp: new Date().toISOString(),
            path: context.getArgs()[0].url,
            message: value.message,
            data: value.data,
          };
        } else {
          console.log(
            `${context.getArgs()[0].method} | ${
              context.getArgs()[1].statusCode
            } | ${context.getArgs()[0].url}\nDelais : ${Date.now() - now}ms`
          );
          return {
            statusCode: context.getArgs()[1].statusCode,
            timestamp: new Date().toISOString(),
            path: context.getArgs()[0].url,
          };
        }
      })
    );
  }
}
```

#### Dans le fichier main de votre API

Entre la creation de la constante et la mise sur écoute du port

```ts
app.useGlobalInterceptors(new ResponserInterceptor());
```

## Responser Exeption

Permet de formater le body des reponses de l'API en cas d'exeption et génére un log dans la console

```ts
{
  statusCode: status,                   /* La valeur du code du status */
  timestamp: new Date().toISOString(),  /* La date et l'heure de la reponse */
  path: request.url,                    /* URL de la demande */
  message: exept                        /* Message d'erreur */
}
```
### Utilisation

#### Création du fichier

Dans votre dossier "src" créez un dossier "interceptors" puis un fichier "responser.exeption.ts" 

Placez à l'interieur le code suivant

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

/**
 * Permet de récupérer l'enssemble des Exceptions issues des divers controleurs.
 * Cette fonctionnalité formate l'erreur avant de la renvoyer dans la console et dans le front.
 *
 * @Responce .statusCode  : Valeur du Code Status de la responce
 * @Responce .timestamp   : Moment d'apparition de l'erreur
 * @Responce .path        : Route utilisée pour aboutir à cette erreur
 * @Responce .message     : Information sur l'erreur
 */
@Catch(HttpException)
export class ResponserExeption implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exept:
      | string
      | { statusCode?: number; message?: string; error?: string } =
      exception.getResponse();

    if (typeof exept === "object") {
      console.log(
        `${request.method} | ${status} | ${request.url}\n${exept.error}`
      );
      response.status(status).json({
        ...exept,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      console.log(`${request.method} | ${status} | ${request.url}\n${exept}`);
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exept,
      });
    }
  }
}
```

#### Dans le fichier main de votre API

Entre la creation de la constante et la mise sur écoute du port

```ts
app.useGlobalFilters(new ResponserExeption());
```
