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

  /**
   * Suppression de tous les utilisateurs
   *
   * @returns Tous les utilisateurs supprimés
   */
  async clear() {
    return await User.remove(await User.find());
  }

  /**
   * Reinitialisation des utilisateurs
   *
   * @returns Tous les utilisateurs
   */
  async reset(users: User[]) {
    return await Promise.all(
      users.map(async (item) => {
        const newUser = User.create(item);
        newUser.id = item.id;
        return await newUser.save();
      }),
    );
  }
}
