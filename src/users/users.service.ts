import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { GetUsersQueryDto } from './dto/get-users.query.dto';
import { sorterQuery } from 'src/utilities/Sorters/SorterQuery';
import { usersFilter } from './filters/users.filter';

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
  async register(dto: Pick<User, 'pseudo' | 'password'>): Promise<User> {
    return await User.create({
      ...dto,
      actif_at: new Date().toISOString(),
    }).save();
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

  /**
   * Trouver un utilisateur par son mail
   *
   * @param mail mail de l'utilisateur recherché
   * @returns l'utilisateur, si il existe, sinon null
   */
  async findOneByMail(mail: string): Promise<User | null> {
    return await User.findOneBy({ mail });
  }

  /**
   * Trouver un utilisateur par son pseudo
   *
   * @param id id de l'utilisateur recherché
   * @returns l'utilisateur, si il existe, sinon null
   */
  async findOneById(id: string): Promise<User | null> {
    return await User.findOneBy({ id });
  }

  /**
   * Trouver plusieurs utilisateurs
   *
   * @returns les utilisateurs trouvés
   */
  async findMany(query: GetUsersQueryDto): Promise<User[]> {
    const { pseudo, first_name, last_name } = query;
    const actif_from = query.actif_from ? Number(query.actif_from) : undefined;

    const order = sorterQuery<User>(query.sort_keys, query.sort_orders);

    const users = (await User.find({ order }))
      .filter((item) =>
        usersFilter(item, pseudo, first_name, last_name, actif_from),
      )

    return users;
  }

  /**
   * Mise à jour d'un utilisateur
   *
   * @param id L'id de l'utilisateur à mettre à jour
   * @param dto parametres de modification d'un utilisateur
   * @returns l'utilisateur modifié
   */
  async update(id: string, dto: Partial<User>): Promise<User | null> {
    const user = await User.findOneBy({ id });
    if (user) {
      if (dto.pseudo) user.pseudo = dto.pseudo;
      if (dto.password) user.password = dto.password;
      if (dto.mail) user.mail = dto.mail;
      if (dto.first_name) user.first_name = dto.first_name;
      if (dto.last_name) user.last_name = dto.last_name;
      await user.save();
    }
    return user;
  }

  /* Ajouter les methodes de service ici */
}
