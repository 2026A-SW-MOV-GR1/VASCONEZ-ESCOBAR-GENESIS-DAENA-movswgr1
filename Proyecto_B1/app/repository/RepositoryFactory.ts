import { IUserRepository } from './IUserRepository';
import { NoSqlUserRepository } from './NoSqlUserRepository';
import { SqliteUserRepository } from './SqliteUserRepository';

export type RepositoryType = 'sql' | 'nosql';

const sqliteRepo = new SqliteUserRepository();
const nosqlRepo = new NoSqlUserRepository();

export let activeRepository: IUserRepository = sqliteRepo;

export function setRepository(type: RepositoryType): void {
    console.log('[INFO] RepositoryFactory: setRepository called with ' + type);
    activeRepository = type === 'nosql' ? nosqlRepo : sqliteRepo;
}

export function getRepository(): IUserRepository {
    return activeRepository;
}
