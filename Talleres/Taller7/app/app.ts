import { Application, AndroidApplication, AndroidActivityEventData } from '@nativescript/core'

// Variable para detectar cuándo la actividad ha estado previamente detenida (onStop)
// y se vuelve a iniciar (onStart) sin haber sido destruida (onDestroy).
// Esto nos permite identificar el evento onRestart de Android.
let isActivityStopped = false;

if (Application.android) {
  const androidApp = Application.android;

  // [Android] onCreate
  // Evento equivalente al método onCreate de la actividad Android.
  // Se ejecuta al crear o recrear la actividad (por ejemplo, al iniciar la aplicación).
  androidApp.on(AndroidApplication.activityCreatedEvent, (args: AndroidActivityEventData) => {
    isActivityStopped = false;
    console.log('[Android] onCreate - La actividad se ha creado o recreado.');
  });

  // [Android] onStart y onRestart
  // Eventos correspondientes a los flujos de inicio y reinicio de la actividad Android.
  // onStart se ejecuta cuando la actividad se vuelve visible.
  // Si la actividad estuvo detenida previamente (onStop = true), se registra onRestart antes de onStart.
  androidApp.on(AndroidApplication.activityStartedEvent, (args: AndroidActivityEventData) => {
    if (isActivityStopped) {
      console.log('[Android] onRestart - La actividad se está reiniciando tras haber estado detenida.');
      isActivityStopped = false;
    }
    console.log('[Android] onStart - La actividad se ha vuelto visible.');
  });

  // [Android] onResume
  // Evento equivalente al método onResume de la actividad Android.
  // Se ejecuta cuando la actividad entra en primer plano y el usuario puede interactuar con ella.
  androidApp.on(AndroidApplication.activityResumedEvent, (args: AndroidActivityEventData) => {
    console.log('[Android] onResume - La actividad ha comenzado a interactuar con el usuario.');
  });

  // [Android] onPause
  // Evento equivalente al método onPause de la actividad Android.
  // Se ejecuta cuando la actividad está perdiendo el foco (por ejemplo, al cambiar de aplicación).
  androidApp.on(AndroidApplication.activityPausedEvent, (args: AndroidActivityEventData) => {
    console.log('[Android] onPause - La actividad está perdiendo el foco.');
  });

  // [Android] onStop
  // Evento equivalente al método onStop de la actividad Android.
  // Se ejecuta cuando la actividad ya no es visible para el usuario.
  androidApp.on(AndroidApplication.activityStoppedEvent, (args: AndroidActivityEventData) => {
    isActivityStopped = true;
    console.log('[Android] onStop - La actividad ya no es visible.');
  });

  // [Android] onDestroy
  // Evento equivalente al método onDestroy de la actividad Android.
  // Se ejecuta antes de que la actividad sea destruida permanentemente.
  androidApp.on(AndroidApplication.activityDestroyedEvent, (args: AndroidActivityEventData) => {
    console.log('[Android] onDestroy - La actividad está siendo destruida.');
  });
}

Application.run({ moduleName: 'app-root' })

