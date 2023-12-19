import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class VisitorAuthGuard extends AuthGuard('visitor') { }
