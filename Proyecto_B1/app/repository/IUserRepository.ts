export interface RepositoryUser {
	id?: number;
	nombre: string;
	profesion: string;
	activo: boolean;
	fecha: Date | string;
}

export interface IUserRepository {
	save(user: object): Promise<void>;
	getAll(): Promise<any[]>;
	delete(id: number): Promise<void>;
	update(user: object): Promise<void>;
}

