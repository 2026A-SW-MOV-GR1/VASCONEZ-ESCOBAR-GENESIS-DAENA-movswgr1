import { File, knownFolders } from '@nativescript/core';

import { IUserRepository, RepositoryUser } from './IUserRepository';

const FILE_NAME = 'usuarios_nosql.json';

function normalizeRepositoryUser(user: object): RepositoryUser {
    const typedUser = user as Partial<RepositoryUser>;
    const fecha = typedUser.fecha instanceof Date
        ? typedUser.fecha
        : typedUser.fecha
            ? new Date(String(typedUser.fecha))
            : new Date();

    return {
        id: typeof typedUser.id === 'number' ? typedUser.id : undefined,
        nombre: String(typedUser.nombre ?? ''),
        profesion: String(typedUser.profesion ?? ''),
        activo: Boolean(typedUser.activo),
        fecha
    };
}

export class NoSqlUserRepository implements IUserRepository {
    async save(user: object): Promise<void> {
        console.log('[INFO] NoSqlRepository: save called');
        console.log('[DEBUG] NoSqlRepository: saving user ' + JSON.stringify(user));

        try {
            const users = await this.readUsers();
            const normalized = normalizeRepositoryUser(user);
            const index = typeof normalized.id === 'number'
                ? users.findIndex(existing => existing.id === normalized.id)
                : -1;

            if (index >= 0) {
                users[index] = normalized;
            } else {
                users.push(normalized);
            }

            await this.writeUsers(users);
        } catch (error) {
            console.error('[ERROR] NoSqlRepository: ' + error);
            throw error;
        }
    }

    async getAll(): Promise<any[]> {
        console.log('[INFO] NoSqlRepository: getAll called');

        try {
            const users = await this.readUsers();
            return users.map(user => ({
                ...user,
                fecha: user.fecha instanceof Date ? user.fecha : new Date(String(user.fecha))
            }));
        } catch (error) {
            console.error('[ERROR] NoSqlRepository: ' + error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        console.log('[INFO] NoSqlRepository: delete called with id ' + id);

        try {
            const users = await this.readUsers();
            const filteredUsers = users.filter(user => user.id !== id);
            await this.writeUsers(filteredUsers);
        } catch (error) {
            console.error('[ERROR] NoSqlRepository: ' + error);
            throw error;
        }
    }

    async update(user: object): Promise<void> {
        console.log('[INFO] NoSqlRepository: update called');
        console.log('[DEBUG] NoSqlRepository: updating user ' + JSON.stringify(user));

        try {
            const users = await this.readUsers();
            const normalized = normalizeRepositoryUser(user);

            if (typeof normalized.id !== 'number') {
                throw new Error('User id is required for update');
            }

            const index = users.findIndex(existing => existing.id === normalized.id);
            if (index >= 0) {
                users[index] = normalized;
            }

            await this.writeUsers(users);
        } catch (error) {
            console.error('[ERROR] NoSqlRepository: ' + error);
            throw error;
        }
    }

    private getUsersFile(): File {
        return knownFolders.documents().getFile(FILE_NAME) as File;
    }

    private async readUsers(): Promise<RepositoryUser[]> {
        try {
            const file = this.getUsersFile();
            const text = await file.readText();
            if (!text) {
                return [];
            }

            const parsed = JSON.parse(text) as Array<Partial<RepositoryUser>>;
            return parsed.map(item => ({
                id: typeof item.id === 'number' ? item.id : undefined,
                nombre: String(item.nombre ?? ''),
                profesion: String(item.profesion ?? ''),
                activo: Boolean(item.activo),
                fecha: item.fecha ? new Date(String(item.fecha)) : new Date()
            }));
        } catch (error) {
            console.log('[DEBUG] NoSqlRepository: read fallback to empty array');
            return [];
        }
    }

    private async writeUsers(users: RepositoryUser[]): Promise<void> {
        const file = this.getUsersFile();
        const payload = users.map(user => ({
            ...user,
            fecha: user.fecha instanceof Date ? user.fecha.toISOString() : new Date(String(user.fecha)).toISOString()
        }));
        await file.writeText(JSON.stringify(payload, null, 2));
    }
}
