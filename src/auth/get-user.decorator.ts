import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

/**
 * Permet de récupérer directement l'utilisateur depuis les arguments d'une requete dans les contrôleurs
 */
export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User =>
{
    const req = ctx.switchToHttp().getRequest();
    const {token, ...result} = req.user
    return result;
});