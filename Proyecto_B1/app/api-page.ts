import { EventData, Observable, Page } from '@nativescript/core';

type ApiViewModel = Observable & {
    txtId: string;
    txtTitulo: string;
    txtBody: string;
    isLoadingGet: boolean;
    isLoadingPut: boolean;
    canEditPost: boolean;
    canUpdatePost: boolean;
    statusMessage: string;
};

let vm: ApiViewModel;

function createVm(): ApiViewModel {
    const observable = new Observable() as ApiViewModel;
    observable.set('txtId', '');
    observable.set('txtTitulo', '');
    observable.set('txtBody', '');
    observable.set('isLoadingGet', false);
    observable.set('isLoadingPut', false);
    observable.set('canEditPost', false);
    observable.set('canUpdatePost', false);
    observable.set('statusMessage', '');
    return observable;
}

function setLoadingGet(pageVm: ApiViewModel, loading: boolean): void {
    pageVm.set('isLoadingGet', loading);
    pageVm.set('canUpdatePost', pageVm.get('canEditPost') === true);
}

function setLoadingPut(pageVm: ApiViewModel, loading: boolean): void {
    pageVm.set('isLoadingPut', loading);
    pageVm.set('canEditPost', !loading && pageVm.get('txtId') !== '');
    pageVm.set('canUpdatePost', !loading && pageVm.get('canEditPost') === true);
}

export function navigatingTo(args: EventData): void {
    const page = args.object as Page;
    vm = vm ?? createVm();
    page.bindingContext = vm;
}

export async function obtenerPost(args: EventData): Promise<void> {
    const button = args.object as { page?: Page };
    const page = button.page;
    if (!page) {
        return;
    }

    const pageVm = page.bindingContext as ApiViewModel;
    const id = String(pageVm.get('txtId') ?? '').trim();

    if (!id) {
        pageVm.set('statusMessage', 'Ingrese un ID');
        return;
    }

    console.log('[INFO] ApiPage: GET start id=' + id);
    pageVm.set('statusMessage', '');
    pageVm.set('isLoadingGet', true);
    pageVm.set('canEditPost', false);
    pageVm.set('canUpdatePost', false);

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const post = await response.json() as { title?: string; body?: string };

        pageVm.set('txtTitulo', String(post.title ?? ''));
        pageVm.set('txtBody', String(post.body ?? ''));
        pageVm.set('canEditPost', true);
        pageVm.set('canUpdatePost', true);
        pageVm.set('statusMessage', 'Post cargado');
        console.log('[INFO] ApiPage: GET success id=' + id);
    } catch (error) {
        pageVm.set('txtTitulo', 'Error');
        pageVm.set('txtBody', String(error));
        pageVm.set('statusMessage', 'Error al obtener el post');
        console.error('[ERROR] ApiPage: ' + error);
    } finally {
        pageVm.set('isLoadingGet', false);
    }
}

export async function actualizarPost(args: EventData): Promise<void> {
    const button = args.object as { page?: Page };
    const page = button.page;
    if (!page) {
        return;
    }

    const pageVm = page.bindingContext as ApiViewModel;
    const id = String(pageVm.get('txtId') ?? '').trim();
    const titulo = String(pageVm.get('txtTitulo') ?? '');
    const body = String(pageVm.get('txtBody') ?? '');

    if (!id) {
        pageVm.set('statusMessage', 'Ingrese un ID');
        return;
    }

    console.log('[INFO] ApiPage: PUT start id=' + id);
    pageVm.set('isLoadingPut', true);
    pageVm.set('canEditPost', false);
    pageVm.set('canUpdatePost', false);

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: Number(id),
                title: titulo,
                body,
                userId: 1
            })
        });

        if (response.status === 200) {
            pageVm.set('statusMessage', 'Post actualizado correctamente');
            const context = require('@nativescript/core/application').android.context;
            android.widget.Toast.makeText(context, 'Post actualizado correctamente', android.widget.Toast.LENGTH_SHORT).show();
            console.log('[INFO] ApiPage: PUT success id=' + id + ' status=' + response.status);
        } else {
            pageVm.set('statusMessage', 'Respuesta inesperada: ' + response.status);
            console.log('[INFO] ApiPage: PUT response status=' + response.status);
        }
    } catch (error) {
        pageVm.set('statusMessage', 'Error al actualizar');
        console.error('[ERROR] ApiPage: ' + error);
        const context = require('@nativescript/core/application').android.context;
        android.widget.Toast.makeText(context, 'Error al actualizar', android.widget.Toast.LENGTH_SHORT).show();
    } finally {
        pageVm.set('isLoadingPut', false);
        pageVm.set('canEditPost', pageVm.get('txtTitulo') !== '' || pageVm.get('txtBody') !== '');
        pageVm.set('canUpdatePost', pageVm.get('canEditPost') === true);
    }
}
