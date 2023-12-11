import { User } from '../entities/user.entity';

export function usersFilter(
  user: User,
  pseudo?: string,
  first_name?: string,
  last_name?: string,
  actif_from?: number,
): boolean {
  const limit = Math.floor(
    (Number(new Date()) - Number(new Date(user.actif_at))) / 60000,
  );

  return (
    (!pseudo || user.pseudo.search(pseudo) >= 0) &&
    (!first_name ||
      (user.first_name !== null && user.first_name.search(first_name) >= 0)) &&
    (!last_name ||
      (user.last_name !== null && user.last_name.search(last_name) >= 0)) &&
    (!actif_from ||
      (actif_from >= 0 && actif_from >= limit) ||
      (actif_from < 0 && -actif_from <= limit))
  );
}
