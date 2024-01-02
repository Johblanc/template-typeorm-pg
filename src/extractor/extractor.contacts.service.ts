import { Injectable } from '@nestjs/common';
import { Contact } from 'src/contacts/entities/contact.entity';

/**
 * Services permetant les methodes relatives à l'extraction zip
 */
@Injectable()
export class ContactsExtractor {
  /**
   * Recupération des contacts en vue d'une extraction en zip
   *
   * @returns Toutes les contacts
   */
  async extract() {
    const contacts = await Contact.find({
      select: {
        status_a: true,
        status_b: true,
        user_a: {
          id: true,
        },
        user_b: { id: true },
      },
      relations: {
        user_a: true,
        user_b: true,
      },
    });

    return contacts.map((item) => {
      return {
        status_a: item.status_a,
        status_b: item.status_b,
        user_a: { id: item.user_a.id },
        user_b: { id: item.user_b.id },
      };
    });
  }

  /**
   * Suppression de toutes les contacts
   *
   * @returns Tous les contacts supprimés
   */
  async clear() {
    return await Contact.remove(await Contact.find());
  }

  /**
   * Reinitialisation des contacts
   *
   * @returns Toutes les contacts
   */
  async reset(contacts: Contact[]) {
    return await Promise.all(
      contacts.map(async (item) => {
        const newContact = Contact.create(item);
        return await newContact.save();
      }),
    );
  }
}
