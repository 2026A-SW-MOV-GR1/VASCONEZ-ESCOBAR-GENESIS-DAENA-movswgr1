import { NoSqlUserRepository } from '../app/repository/NoSqlUserRepository';
import { getRepository, setRepository } from '../app/repository/RepositoryFactory';
import { SqliteUserRepository } from '../app/repository/SqliteUserRepository';

type TestFn = () => Promise<void>;

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

async function testNoSqlRepository(): Promise<void> {
    const repo = new NoSqlUserRepository();
    const user = { id: 99, nombre: 'Test', profesion: 'Dev', activo: true, fecha: new Date() };

    await repo.save(user);
    const users = await repo.getAll();
    assert(users.some((item) => Number(item.id) === 99), 'Expected saved user id 99');
}

async function testRepositoryFactory(): Promise<void> {
    setRepository('sql');
    assert(getRepository() instanceof SqliteUserRepository, 'Expected SqliteUserRepository');

    setRepository('nosql');
    assert(getRepository() instanceof NoSqlUserRepository, 'Expected NoSqlUserRepository');
}

export async function runTests(): Promise<void> {
    const tests: Array<{ name: string; run: TestFn }> = [
        { name: 'NoSqlUserRepository save/getAll', run: testNoSqlRepository },
        { name: 'RepositoryFactory switching', run: testRepositoryFactory }
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
