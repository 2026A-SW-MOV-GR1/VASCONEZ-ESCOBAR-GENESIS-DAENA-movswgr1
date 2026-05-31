import { NoSqlUserRepository } from '../repository/NoSqlUserRepository';
import { setRepository, getRepository } from '../repository/RepositoryFactory';
import { SqliteUserRepository } from '../repository/SqliteUserRepository';

type TestCase = {
    name: string;
    run: () => Promise<void>;
};

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

async function testNoSqlSaveAndGetAll(): Promise<void> {
    const repo = new NoSqlUserRepository();
    const user = { id: 99, nombre: 'Test', profesion: 'Dev', activo: true, fecha: new Date() };

    await repo.save(user);
    const users = await repo.getAll();
    assert(users.some((item) => Number(item.id) === 99), 'Expected saved user with id 99');
}

async function testRepositoryFactorySwitch(): Promise<void> {
    setRepository('sql');
    assert(getRepository() instanceof SqliteUserRepository, 'Expected SqliteUserRepository instance');

    setRepository('nosql');
    assert(getRepository() instanceof NoSqlUserRepository, 'Expected NoSqlUserRepository instance');
}

export async function runTests(): Promise<void> {
    const tests: TestCase[] = [
        { name: 'NoSqlUserRepository save/getAll', run: testNoSqlSaveAndGetAll },
        { name: 'RepositoryFactory switch', run: testRepositoryFactorySwitch }
    ];

    for (const test of tests) {
        try {
            await test.run();
            console.log('[PASS] ' + test.name);
        } catch (error) {
            console.error('[FAIL] ' + test.name + ': ' + error);
            throw error;
        }
    }
}
