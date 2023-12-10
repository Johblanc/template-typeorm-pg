import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';


/**
 * Vérification des parametres de l'utilisateur lors du login
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({usernameField: 'pseudo',});
  }

/**
 * Vérification des parametres de l'utilisateur lors du login
 * 
 * @param pseudo le nom de l'utilisateur
 * @param password le mot de passe de l'utilisateur
 * @returns l'utilisateur vérifié
 */
  async validate(pseudo: string, password: string): Promise<(Partial<User> & { token: string }) | null> {

    const user = await this.authService.validateUser(pseudo, password);
    if (!user) {
      throw new UnauthorizedException("Vous n'êtes pas enregisté");
    }
    return user;
  }
}