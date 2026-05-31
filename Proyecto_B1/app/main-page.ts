import { EventData, Observable, Page, Frame, Switch } from '@nativescript/core';

import * as app from '@nativescript/core/application';
import { getRepository, setRepository } from './repository/RepositoryFactory';
import { IUserRepository, RepositoryUser } from './repository/IUserRepository';
import { NoSqlUserRepository } from './repository/NoSqlUserRepository';

// Compatibility fallback only; the ListView is now driven by the active repository.
export const usuarios: RepositoryUser[] = [];

type MainViewModel = Observable & {
    usuarios: RepositoryUser[];
    isNoSql: boolean;
    persistenceLabel: string;
    persistenceColor: string;
};

const vm = new Observable() as MainViewModel;
let activeRepository: IUserRepository = getRepository();

function syncPersistenceUi(): void {
    const isNoSql = vm.get('isNoSql') === true;
    vm.set('persistenceLabel', isNoSql ? '🗂️ NoSQL' : '📦 SQLite');
    vm.set('persistenceColor', isNoSql ? '#1B5E20' : '#1565C0');
}

async function loadUsersFromRepository(): Promise<void> {
    try {
        console.log('[INFO] MainPage: loading users from repository');
        const repoUsers = await getRepository().getAll();
        vm.set('usuarios', repoUsers);
    } catch (error) {
        console.error('[ERROR] MainPage: ' + error);
        vm.set('usuarios', []);
    }
}

export function navigatingTo(args: EventData): void {
    const page = args.object as Page;
    vm.set('usuarios', usuarios.slice());
    vm.set('isNoSql', getRepository() instanceof NoSqlUserRepository);
    syncPersistenceUi();
    page.bindingContext = vm;
    void loadUsersFromRepository();
}

export async function onPersistenceChange(args: EventData): Promise<void> {
    const switchWidget = args.object as Switch;
    const isNoSql = switchWidget.checked;
    vm.set('isNoSql', isNoSql);
    syncPersistenceUi();
    console.log('[INFO] MainPage: persistence switch changed -> ' + (isNoSql ? 'nosql' : 'sql'));
    setRepository(isNoSql ? 'nosql' : 'sql');
    await loadUsersFromRepository();
}

export async function nuevoUsuario(): Promise<void> {
    console.log('[INFO] MainPage: new user flow');
    Frame.topmost().navigate({ moduleName: 'form-page', context: { mode: 'create' } });
}

export async function editarUsuario(args: EventData): Promise<void> {
    const usuario = (args.object as any).bindingContext;
    console.log('[INFO] MainPage: edit user id=' + usuario.id);
    Frame.topmost().navigate({ moduleName: 'form-page', context: { mode: 'edit', usuario } });
}

export async function eliminarUsuario(args: EventData): Promise<void> {
    const usuario = (args.object as any).bindingContext;
    console.log('[INFO] MainPage: delete user id=' + usuario.id);

    if ((global as { android?: unknown }).android) {
        const ctx = app.android.foregroundActivity || app.android.context;
        const builder = new android.app.AlertDialog.Builder(ctx);
        builder.setTitle('Confirmar');
        builder.setMessage(`¿Eliminar a ${usuario.nombre}?`);
        builder.setPositiveButton('Sí', new android.content.DialogInterface.OnClickListener({
            onClick: function (): void {
                void (async (): Promise<void> => {
                    try {
                        await getRepository().delete(Number(usuario.id));
                        await loadUsersFromRepository();
                        android.widget.Toast.makeText(ctx, 'Usuario eliminado', android.widget.Toast.LENGTH_SHORT).show();
                    } catch (error) {
                        console.error('[ERROR] MainPage: ' + error);
                    }
                })();
            }
        }));
        builder.setNegativeButton('No', null);
        builder.show();
    }
}

export function refreshUsuarios(): void {
    void loadUsersFromRepository();
}

export function abrirApi(): void {
    Frame.topmost().navigate('api-page');
}

export function abrirSecretos(): void {
    Frame.topmost().navigate('secrets-page');
}
