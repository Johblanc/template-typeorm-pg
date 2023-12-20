import { User } from "src/users/entities/user.entity";

export type TContact = {
  wait_for: Partial<User>[];
  wait_you: Partial<User>[];
  friends: Partial<User>[];
  banned: Partial<User>[];
  banned_you: Partial<User>[];
}