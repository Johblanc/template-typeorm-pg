import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Contact } from 'src/contacts/entities/contact.entity';
import { TContact } from 'src/contacts/entities/contact.type';
import { Image } from 'src/images/entities/image.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Utilisateur de l'Api
 */
@Entity('users')
export class User extends BaseEntity {
  /** Identifiant de l'Utilisateur */
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Pseudonime de l'Utilisateur */
  @ApiProperty()
  @Column({ unique: true })
  pseudo: string;

  /** Le mot de passe de l'Utilisateur */
  @Exclude()
  @ApiProperty()
  @Column()
  password: string;

  /** Prénom de l'Utilisateur */
  @ApiProperty()
  @Column({ type: 'character varying', nullable: true })
  first_name: string | null;

  /** Nom de l'Utilisateur */
  @ApiProperty()
  @Column({ type: 'character varying', nullable: true })
  last_name: string | null;

  /** Mail de l'Utilisateur */
  @ApiProperty()
  @Column({ type: 'character varying', nullable: true, select: false })
  mail: string | null;

  /** Date de création de l'utilisateur */
  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  creat_at: string;

  /** Date de dernière activité de l'utilisateur */
  @ApiProperty()
  @Column({ type: 'timestamptz' })
  actif_at: string;

  /** Avatar de l'utilisateur */
  @ApiProperty()
  @OneToOne(() => Image, (image) => image.user, { nullable: true, eager: true })
  @JoinColumn()
  image: Image | null;

  /** Roles de l'utilisateur */
  @ApiProperty()
  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  sub_roles: Role[];

  @ApiProperty()
  @OneToMany(() => Contact, (contact) => contact.user_a)
  contacts_a: Contact[];

  @ApiProperty()
  @OneToMany(() => Contact, (contact) => contact.user_b)
  contacts_b: Contact[];

  @ApiProperty()
  @Expose()
  get role() {
    let acces_level = 0;
    if (this.sub_roles.length > 0) {
      this.sub_roles.forEach((item) => {
        acces_level = Math.max(acces_level, item.acces_level);
      });
    }
    return {
      acces_level,
    };
  }

  viewContacts(claimant?: User | 'self' | 'admin' | 'user'): TContact | undefined {
    if (this.contacts_a === undefined || this.contacts_b === undefined) {
      return undefined;
    }

    const c = [
      ...(this.contacts_a || []).map((item) => item.view_as_a(claimant)),
      ...(this.contacts_b || []).map((item) => item.view_as_b(claimant)),
    ];
    return {
      wait_for: c
        .filter((item) => item.status === '10')
        .map((item) => item.user),
      wait_you: c
        .filter((item) => item.status === '01')
        .map((item) => item.user),
      friends: c
        .filter((item) => item.status === '11')
        .map((item) => item.user),
      banned: c
        .filter((item) => item.status.split('')[0] === '2')
        .map((item) => item.user),
      banned_you: c
        .filter((item) => item.status.split('')[1] === '2')
        .map((item) => item.user),
    };
  }

  view(claimant?: User | 'self' | 'admin' | 'user'): Partial<User> & {contacts? : TContact | undefined} {
    let role: string | undefined = undefined;

    if (typeof claimant === 'string') {
      role = claimant;
    } else if (claimant !== undefined) {
      if (claimant.id === this.id) {
        role = 'self';
      } else if (claimant.role.acces_level === 2) {
        role = 'admin';
      } else if (claimant.role.acces_level === 1) {
        role = 'user';
      }
    }

    const base = {
      id: this.id,
      pseudo: this.pseudo,
      image: this.image,
    };
    const forUser = {
      ...base,
      actif_at: this.actif_at,
      role: this.role,
    };
    const forSelf = {
      ...forUser,
      first_name: this.first_name,
      last_name: this.last_name,
      mail: this.mail,
      creat_at: this.creat_at,
      contacts: this.viewContacts(claimant),
    };
    const forAdmin = {
      ...forSelf,
      sub_roles: this.sub_roles,
    };

    if (role === 'admin') {
      return forAdmin;
    }
    if (role === 'self') {
      return forSelf;
    }
    if (role === 'user') {
      return forUser;
    }
    return base;
  }
}
