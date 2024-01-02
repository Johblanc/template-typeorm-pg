import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  async create(
    user_a: User,
    user_b: User,
    status_a?: 0 | 1 | 2,
    status_b?: 0 | 1 | 2,
  ) {
    const contact = Contact.create({ user_a, user_b, status_a, status_b });
    return await contact.save();
  }
  async findOneStatus(user_a: User, user_b: User) {
    let contact = await Contact.findOne({
      where: {
        user_a: { id: user_a.id },
        user_b: { id: user_b.id },
      },
      relations: {
        user_a: true,
        user_b: true,
      },
    });

    if (contact !== null) {
      return contact.view_as_a('admin').status;
    }
    contact = await Contact.findOne({
      where: {
        user_a: { id: user_b.id },
        user_b: { id: user_a.id },
      },
      relations: {
        user_a: true,
        user_b: true,
      },
    });

    if (contact !== null) {
      return contact.view_as_b('admin').status;
    }

    return '00';
  }

  async update(
    user_a: User,
    user_b: User,
    status_a?: 0 | 1 | 2,
    status_b?: 0 | 1 | 2,
  ) {
    let contact = await Contact.findOne({
      where: {
        user_a: { id: user_a.id },
        user_b: { id: user_b.id },
      },
      relations: {
        user_a: true,
        user_b: true,
      },
    });

    if (contact !== null) {
      if (status_a !== undefined) {
        contact.status_a = status_a;
      }
      if (status_b !== undefined) {
        contact.status_b = status_b;
      }
      if (contact.status_a === 0 && contact.status_b === 0 ){
        return await contact.remove();
      }
      return await contact.save();
    }
    contact = await Contact.findOne({
      where: {
        user_a: { id: user_b.id },
        user_b: { id: user_a.id },
      },
      relations: {
        user_a: true,
        user_b: true,
      },
    });

    if (contact !== null) {
      if (status_a !== undefined) {
        contact.status_b = status_a;
      }
      if (status_b !== undefined) {
        contact.status_a = status_b;
      }
      if (contact.status_a === 0 && contact.status_b === 0 ){
        return await contact.remove();
      }
      return await contact.save();
    }

    return null;
  }

  async remove(user_a: User, user_b: User) {
    let contact = await Contact.findOne({
      where: {
        user_a: { id: user_a.id },
        user_b: { id: user_b.id },
      },
      relations: {
        user_a: true,
        user_b: true,
      },
    });

    if (contact !== null) {
      return await contact.remove();
    }
    contact = await Contact.findOne({
      where: {
        user_a: { id: user_b.id },
        user_b: { id: user_a.id },
      },
      relations: {
        user_a: true,
        user_b: true,
      },
    });

    if (contact !== null) {
      return await contact.remove();
    }

    return null;
  }
}
