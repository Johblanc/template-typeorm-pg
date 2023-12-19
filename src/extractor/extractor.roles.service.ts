import { Injectable } from '@nestjs/common';
import { Role } from 'src/roles/entities/role.entity';

/**
 * Services permetant les methodes relatives à l'extraction zip
 */
@Injectable()
export class RolesExtractor {
  

  /**
   * Suppression de tous les roles
   *
   * @returns Tous les roles supprimés
   */
  async clear() {
    return await Role.remove(await Role.find());
  }

  /**
   * Reinitialisation des roles
   *
   * @returns Tous les roles
   */
  async reset() {
    const roles = [
      {
        nmae : "visitor",
        acces_level : 0
      },
      {
        nmae : "user",
        acces_level : 1
      },
      {
        nmae : "admin",
        acces_level : 2
      }
    ]

    return await Promise.all(
      roles.map(async (item) => {
        const newRole = Role.create(item);
        return await newRole.save();
      }),
    );
  }
}
