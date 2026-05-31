import { EventData, Observable, Page, Application } from '@nativescript/core';

type StorageOption = 'SharedPreferences' | 'DataStore' | 'EncryptedSharedPreferences';

type SecretsViewModel = Observable & {
    key: string;
    value: string;
    storageOptions: string[];
    selectedStorageIndex: number;
    result: string;
    valueVisibility: 'visible' | 'collapse';
};

let vm: SecretsViewModel;

function createVm(): SecretsViewModel {
    const observable = new Observable() as SecretsViewModel;
    observable.set('key', '');
    observable.set('value', '');
    observable.set('storageOptions', ['SharedPreferences', 'DataStore', 'EncryptedSharedPreferences']);
    observable.set('selectedStorageIndex', 0);
    observable.set('result', '');
    observable.set('valueVisibility', 'visible');
    return observable;
}

function getContext(): android.content.Context {
    return require('@nativescript/core/application').android.context;
}

function getSelectedStorage(pageVm: SecretsViewModel): StorageOption {
    const index = Number(pageVm.get('selectedStorageIndex') ?? 0);
    return (pageVm.get('storageOptions') as string[])[index] as StorageOption;
}

function getPrefs(storage: StorageOption): any {
    const context = getContext();
    if (storage === 'DataStore') {
        return context.getSharedPreferences('datastore_prefs', android.content.Context.MODE_PRIVATE);
    }
    if (storage === 'EncryptedSharedPreferences') {
        try {
            const MasterKeyBuilder = (androidx as any).security.crypto.MasterKey.Builder;
            const KeyScheme = (androidx as any).security.crypto.MasterKey.KeyScheme;
            const EncryptedSharedPrefs = (androidx as any).security.crypto.EncryptedSharedPreferences;

            const masterKey = new MasterKeyBuilder(context)
                .setKeyScheme(KeyScheme.AES256_GCM)
                .build();

            return EncryptedSharedPrefs.create(
                context,
                'encrypted_prefs',
                masterKey,
                EncryptedSharedPrefs.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPrefs.PrefValueEncryptionScheme.AES256_GCM
            );
        } catch (error) {
            console.error('[ERROR] SecretsPage: encrypted prefs ' + error);
            return context.getSharedPreferences('encrypted_prefs', android.content.Context.MODE_PRIVATE);
        }
    }
    return context.getSharedPreferences('default_prefs', android.content.Context.MODE_PRIVATE);
}

function showToast(message: string): void {
    const context = getContext();
    android.widget.Toast.makeText(context, message, android.widget.Toast.LENGTH_SHORT).show();
}

export function navigatingTo(args: EventData): void {
    const page = args.object as Page;
    vm = vm ?? createVm();
    page.bindingContext = vm;
}

export function saveSecret(args: EventData): void {
    try {
        const page = (args.object as { page?: Page }).page;
        if (!page) {
            return;
        }

        const pageVm = page.bindingContext as SecretsViewModel;
        const key = String(pageVm.get('key') ?? '').trim();
        const value = String(pageVm.get('value') ?? '');
        const storage = getSelectedStorage(pageVm);

        if (!key) {
            pageVm.set('result', 'Ingrese una clave');
            return;
        }

        const prefs = getPrefs(storage);
        prefs.edit().putString(key, value).apply();
        pageVm.set('result', `Guardado en ${storage}`);
        console.log('[INFO] SecretsPage: saved key=' + key + ' storage=' + storage);
        showToast(`Guardado en ${storage}`);
    } catch (error) {
        console.error('[ERROR] SecretsPage: ' + error);
        const pageVm = (args.object as { page?: Page }).page?.bindingContext as SecretsViewModel | undefined;
        pageVm?.set('result', 'Error al guardar');
    }
}

export function getSecret(args: EventData): void {
    try {
        const page = (args.object as { page?: Page }).page;
        if (!page) {
            return;
        }

        const pageVm = page.bindingContext as SecretsViewModel;
        const key = String(pageVm.get('key') ?? '').trim();
        const storage = getSelectedStorage(pageVm);

        pageVm.set('valueVisibility', 'collapse');

        if (!key) {
            pageVm.set('result', 'Ingrese una clave');
            return;
        }

        const prefs = getPrefs(storage);
        const value = prefs.getString(key, null);

        if (value !== null) {
            pageVm.set('result', value);
            console.log('[INFO] SecretsPage: recovered key=' + key + ' storage=' + storage);
        } else {
            pageVm.set('result', 'Secreto no encontrado');
        }
    } catch (error) {
        console.error('[ERROR] SecretsPage: ' + error);
        const pageVm = (args.object as { page?: Page }).page?.bindingContext as SecretsViewModel | undefined;
        pageVm?.set('result', 'Error al recuperar');
    } finally {
        const page = (args.object as { page?: Page }).page;
        const pageVm = page?.bindingContext as SecretsViewModel | undefined;
        pageVm?.set('valueVisibility', 'visible');
    }
}
