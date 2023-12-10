import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

/**
 * Liaison avec la table users de la BDD
 */
@Injectable()
export class UsersService {
  /**
   * Demande de création d'un utilisateur
   *
   * @param createUserDto parametres de création d'un utilisateur
   * @returns le nouvel utilisateur
   */
  async register(dto: Pick<User, "pseudo" | "password">): Promise<User> {
    return await User.create({ ...dto, actif_at: new Date().toISOString() }).save();
  }

  /**
   * Trouver un utilisateur par son pseudo
   *
   * @param pseudo pseudo de l'utilisateur recherché
   * @returns l'utilisateur, si il existe, sinon null
   */
  async findOneByPseudo(pseudo: string): Promise<User | null> {
    return await User.findOneBy({ pseudo });
  }

  
  /* Ajouter les methodes de service ici */
}
