import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  async promoteToAdmin(userId: string) {
    const roles = await Role.find();
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
      user.sub_roles = roles;
      await user.save();
    }
    return user;
  }
}
