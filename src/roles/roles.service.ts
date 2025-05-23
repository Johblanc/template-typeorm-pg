import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  async promoteToAdmin(userId: string) {
    let roles = await Role.find();
    if (roles.length === 0) {
      roles = await this.reset()
    }
    
    const user = await User.findOneBy({ id: userId });
    if (user !== null) {
      user.sub_roles = roles;
      await user.save();
    }
    return user;
  }

  async promote(userId: string, sub_roles: string[]) {

    const roles = await Role.find({
      where: sub_roles.map((item) => {
        return { name: item };
      }),
    });
    const user = await User.findOneBy({ id: userId });
    if (user !== null) {
      user.sub_roles = sub_roles.length !== 0 ? roles : [];
      await user.save();
    }
    return user;
  }

  
  async reset() {
    const roles = [
      {
        name : "visitor",
        acces_level : 0
      },
      {
        name : "user",
        acces_level : 1
      },
      {
        name : "admin",
        acces_level : 2
      }
    ]

    return await Promise.all(
      roles.map(async (item) => {
        const newRole = Role.create({...item});
        return await newRole.save();
      }),
    );
  }
}
