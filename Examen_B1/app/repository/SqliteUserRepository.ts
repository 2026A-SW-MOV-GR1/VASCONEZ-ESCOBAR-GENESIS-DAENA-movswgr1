import { IUserRepository, RepositoryUser } from './IUserRepository';

import * as Sqlite from 'nativescript-sqlite';

type SqliteDb = {
    resultType: (value: number) => void;
    valueType: (value: number) => void;
    execSQL: (sql: string, params?: unknown[]) => Promise<unknown>;
    all: (sql: string, params?: unknown[]) => Promise<any[]>;
};

const DB_NAME = 'usuarios.db';
const CREATE_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        profesion TEXT,
        activo INTEGER,
        fecha TEXT
    )
`;

function toIsoString(fecha: Date | string | undefined): string {
    if (fecha instanceof Date) return fecha.toISOString();
    if (fecha) return new Date(String(fecha)).toISOString();
    return new Date().toISOString();
}

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

function mapRowToUser(row: any): RepositoryUser {
    return {
        id: Number(row.id),
        nombre: String(row.nombre ?? ''),
        profesion: String(row.profesion ?? ''),
        activo: Number(row.activo) === 1,
        fecha: row.fecha ? new Date(String(row.fecha)) : new Date()
    };
}

export class SqliteUserRepository implements IUserRepository {
    private dbPromise: Promise<SqliteDb>;

    constructor() {
        this.dbPromise = this.initializeDatabase();
    }

    async save(user: object): Promise<void> {
        console.log('[INFO] SqliteRepository: save called');
        try {
            const db = await this.getDatabase();
            const normalized = normalizeRepositoryUser(user);
            const fechaStr = normalized.fecha instanceof Date
                ? normalized.fecha.toISOString()
                : new Date(String(normalized.fecha)).toISOString();
            const activoInt = normalized.activo ? 1 : 0;

            if (typeof normalized.id === 'number') {
                await db.execSQL(
                    'INSERT OR REPLACE INTO usuarios (id, nombre, profesion, activo, fecha) VALUES (?, ?, ?, ?, ?)',
                    [normalized.id, normalized.nombre, normalized.profesion, activoInt, fechaStr]
                );
            } else {
                await db.execSQL(
                    'INSERT INTO usuarios (nombre, profesion, activo, fecha) VALUES (?, ?, ?, ?)',
                    [normalized.nombre, normalized.profesion, activoInt, fechaStr]
                );
            }
        } catch (error) {
            console.error('[ERROR] SqliteRepository: ' + error);
            throw error;
        }
    }

    async getAll(): Promise<any[]> {
        console.log('[INFO] SqliteRepository: getAll called');

        try {
            const db = await this.getDatabase();
            const rows = await db.all('SELECT id, nombre, profesion, activo, fecha FROM usuarios ORDER BY id ASC');
            return rows.map(mapRowToUser);
        } catch (error) {
            console.error('[ERROR] SqliteRepository: ' + error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        console.log('[INFO] SqliteRepository: delete called with id ' + id);

        try {
            const db = await this.getDatabase();
            await db.execSQL('DELETE FROM usuarios WHERE id = ?', [id]);
        } catch (error) {
            console.error('[ERROR] SqliteRepository: ' + error);
            throw error;
        }
    }

    async update(user: object): Promise<void> {
        console.log('[INFO] SqliteRepository: update called');
        try {
            const db = await this.getDatabase();
            const normalized = normalizeRepositoryUser(user);
            if (typeof normalized.id !== 'number') throw new Error('User id is required for update');
            const fechaStr = normalized.fecha instanceof Date
                ? normalized.fecha.toISOString()
                : new Date(String(normalized.fecha)).toISOString();
            const activoInt = normalized.activo ? 1 : 0;
            await db.execSQL(
                'UPDATE usuarios SET nombre = ?, profesion = ?, activo = ?, fecha = ? WHERE id = ?',
                [normalized.nombre, normalized.profesion, activoInt, fechaStr, normalized.id]
            );
        } catch (error) {
            console.error('[ERROR] SqliteRepository: ' + error);
            throw error;
        }
    }

    private async initializeDatabase(): Promise<SqliteDb> {
        const db = await new Sqlite(DB_NAME);
        db.resultType(Sqlite.RESULTSASOBJECT);
        db.valueType(Sqlite.VALUESARENATIVE);
        await db.execSQL(CREATE_TABLE_SQL);
        return db;
    }

    private async getDatabase(): Promise<SqliteDb> {
        return this.dbPromise;
    }
}
