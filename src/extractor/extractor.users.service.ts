import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

/**
 * Services permetant les methodes relatives à l'extraction zip
 */
@Injectable()
export class UsersExcractor {
  /**
   * Recupération des utilisateurs en vue d'une extraction en zip
   *
   * @returns Tous les utilisateurs
   */
  async extract() {
    return await User.find({select : {
      id: true,
      pseudo: true,
      password: true,
      first_name: true,
      last_name: true,
      creat_at: true,
      actif_at: true,
      mail: true
    }});
  }
}
