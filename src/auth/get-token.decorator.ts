import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Permet de récupérer directement le nouveau token
 */
export const GetToken = createParamDecorator((_data, ctx: ExecutionContext): string =>
{
    const req = ctx.switchToHttp().getRequest();
    return req.user.token;
});