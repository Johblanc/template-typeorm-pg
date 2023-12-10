import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

/**
 * Vérification du mot de passe et création du token pour le login
 */
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Création du token
   *
   * @param user L'utilisateur pour lequel le token doit être créé
   * @returns le nouveau token
   */
  token(user: User) {
    const payload = { pseudo: user.pseudo, sub: user.id };
    return this.jwtService.sign(payload);
  }

  /**
   * Vérication de mot de passe
   * @param pseudo le pseudo de l'utilisateur
   * @param password le mot de passe de l'utilisateur
   * @returns l'utilisateur sans mot de passe avec le nouveau token
   */
  async validateUser(
    pseudo: string,
    password: string,
  ): Promise<(Partial<User> & { token: string }) | null> {
    const user = await User.findOne({
      where: { pseudo },
      select: {
        id: true,
        pseudo: true,
        password: true,
      },
    });
    if (user !== null) {
      const isOk = await bcrypt.compare(password, user.password);

      if (isOk) {
        user.actif_at = new Date().toISOString();
        await user.save();
        const { password, ...result } = {
          ...user,
          token: this.token(user),
        };
        return result;
      }
    }
    return null;
  }

  /**
   * Trouver un utilisateur par token
   *
   * @param token token de l'utilisateur recherché
   * @returns l'utilisateur, si il existe, sinon null
   */
  async findOneByToken(token: {
    pseudo: string;
    sub: string;
    iat: number;
  }): Promise<(Partial<User> & { token: string }) | null> {
    const user = await User.findOne({where :{ pseudo: token.pseudo, id: token.sub },select:{
      id: true,
      pseudo: true,
      first_name: true,
      last_name: true,
      creat_at: true,
      actif_at: true,
      mail: true
    }});
    

    if (user !== null) {
      user.actif_at = new Date().toISOString();
      await user.save();
      return {
        ...user,
        token: this.token(user),
      };
    }

    return null;
  }
}
