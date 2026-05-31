import {
    EventData,
    TextField,
    Page,
    Frame,
    Page as PageClass,
    Switch,
    DatePicker
} from '@nativescript/core';

import { refreshUsuarios } from './main-page';
import * as app from '@nativescript/core/application';
import { getRepository } from './repository/RepositoryFactory';
import { RepositoryUser } from './repository/IUserRepository';

let currentUsuario: RepositoryUser | null = null;
let isEditMode = false;

export function navigatingTo(args: EventData) {
    const page = args.object as PageClass;

    // Get navigation context
    const navigationContext = (args.object as any).navigationContext || {};
    const mode = navigationContext.mode || "create";
    currentUsuario = navigationContext.usuario || null;

    isEditMode = mode === "edit" && currentUsuario !== null;

    // Create binding context
    const vm: any = {};

    // Defaults for create mode
    vm.nombre = "";
    vm.profesion = "";
    vm.activo = true;
    vm.fecha = new Date();

    if (isEditMode && currentUsuario) {
        // Load existing user data (use defaults when fields missing)
        vm.nombre = currentUsuario.nombre || "";
        vm.profesion = currentUsuario.profesion || "";
        vm.activo = typeof currentUsuario.activo !== 'undefined' ? currentUsuario.activo : true;
        vm.fecha = currentUsuario.fecha ? new Date(currentUsuario.fecha) : new Date();
    }

    // Set button text
    const btnGuardar = page.getViewById("btnGuardar") as any;
    if (btnGuardar) {
        btnGuardar.text = isEditMode ? "Actualizar Usuario" : "Guardar Usuario";
    }

    page.bindingContext = vm;
}

export async function guardarUsuario(args: EventData): Promise<void> {
    const button = args.object as any;
    const page = button.page as Page;

    // Get form field values
    const txtNombre = page.getViewById("txtNombre") as TextField;
    const txtProfesion = page.getViewById("txtProfesion") as TextField;
    const switchActivo = page.getViewById('switchActivo') as Switch;
    const datePicker = page.getViewById('datePicker') as DatePicker;

    const nombre = txtNombre.text?.trim() || "";
    const profesion = txtProfesion.text?.trim() || "";

    // Read switch and date values
    const activo = !!switchActivo.checked;
    const fecha = datePicker.date ? new Date(datePicker.date) : new Date();

    // Validation
    if (!nombre || !profesion) {
        showToast("Complete todos los campos");
        return;
    }

    try {
        if (isEditMode && currentUsuario) {
            // UPDATE MODE
            const usuario: RepositoryUser = {
                id: currentUsuario.id,
                nombre,
                profesion,
                activo,
                fecha
            };
            console.log('[INFO] FormPage: update user id=' + usuario.id);
            await getRepository().update(usuario);
            showToast("Usuario actualizado");
        } else {
            // CREATE MODE
            const repoUsers = await getRepository().getAll();
            const newId = Math.max(...repoUsers.map(u => Number(u.id) || 0), 0) + 1;
            const nuevoUsuario: RepositoryUser = {
                id: newId,
                nombre: nombre,
                profesion: profesion,
                activo: activo,
                fecha: fecha
            };
            console.log('[INFO] FormPage: save new user id=' + newId);
            await getRepository().save(nuevoUsuario);
            showToast("Usuario creado");
        }

        // refresh main list
        try { refreshUsuarios(); } catch (e) { /* ignore */ }

        // Navigate back
        Frame.topmost().goBack();
    } catch (error) {
        console.error('[ERROR] FormPage: ' + error);
        showToast("Error al guardar");
    }
}

function showToast(message: string) {
    const context = app.android.context;
    android.widget.Toast.makeText(
        context,
        message,
        android.widget.Toast.LENGTH_SHORT
    ).show();
}
