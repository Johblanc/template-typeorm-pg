import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TPaging } from 'src/utilities/Paging/Paging.type';

/**
 * Permet de récupérer l'enssemble des Requetes issues du front, de les chronométrer puis de les formater avant de les renvoyer.
 *
 * @return .statusCode  : Valeur du Code Status de la responce
 * @return .timestamp   : Moment de la Réponce
 * @return .path        : Route utilisée pour aboutir à cette Réponce
 * @return .message     : Information sur la Réponce
 * @return .data        : Les Données demandées
 * @return .token       : Le renouvellement du token
 * @return .pages       : Les informations sur une éventuelle pagination
 */
@Injectable()
export class ResponserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      map(
        (value?: {
          message: string;
          data: any;
          token?: string;
          pages?: TPaging;
        }) => {
          if (value) {
            console.log(
              `${context.getArgs()[0].method} | ${
                context.getArgs()[1].statusCode
              } | ${context.getArgs()[0].url}\nDelais : ${
                Date.now() - now
              }ms\n${value.message}`,
            );
            return {
              statusCode: context.getArgs()[1].statusCode,
              timestamp: new Date().toISOString(),
              path: context.getArgs()[0].url,
              message: value.message,
              data: value.data,
              token: value.token,
              pages: value.pages,
            };
          } else {
            console.log(
              `${context.getArgs()[0].method} | ${
                context.getArgs()[1].statusCode
              } | ${context.getArgs()[0].url}\nDelais : ${Date.now() - now}ms`,
            );
            return {
              statusCode: context.getArgs()[1].statusCode,
              timestamp: new Date().toISOString(),
              path: context.getArgs()[0].url,
            };
          }
        },
      ),
    );
  }
}
