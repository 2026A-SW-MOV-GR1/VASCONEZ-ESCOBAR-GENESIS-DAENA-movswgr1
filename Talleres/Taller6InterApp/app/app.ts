/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import { Application, AndroidApplication, Frame } from '@nativescript/core'

// Android global (available at runtime on Android). Declare for TypeScript.
declare const android: any

// Handle incoming Android Intents so the app can receive shared text/images from other apps.
function handleAndroidIntent(activity: any) {
  try {
	const intent = activity.getIntent()
	if (!intent) {
	  return
	}

	const action = intent.getAction()
	const type = intent.getType()

	// Prepare a simple context to send to incoming-page
	const context: any = { receivedText: '', imageSrc: '', status: '' }

	const Intent = (android && android.content && android.content.Intent) ? android.content.Intent : null

	if (action === (Intent && Intent.ACTION_SEND) && type) {
	  if (type.indexOf('text/') === 0) {
		const extra = intent.getStringExtra(android.content.Intent.EXTRA_TEXT) || ''
		context.receivedText = extra
		context.status = 'Texto recibido'
	  } else if (type.indexOf('image/') === 0) {
		const stream = intent.getParcelableExtra(android.content.Intent.EXTRA_STREAM)
		if (stream) {
		  // Use the Uri string as image source. Many Android content:// URIs can be used directly by NativeScript Image.
		  context.imageSrc = stream.toString()
		  context.status = 'Imagen recibida'
		}
	  }
	} else if (action === (Intent && Intent.ACTION_SEND_MULTIPLE) && type) {
	  context.status = 'Multiple items received'
	}

	// If we have any payload, navigate to incoming page.
	if (context.receivedText || context.imageSrc) {
	  // Ensure navigation runs on UI thread
	  setTimeout(() => {
		Frame.topmost()?.navigate({ moduleName: 'incoming-page', context })
	  }, 100)
	}
  } catch (e) {
	console.error('Error handling Android intent:', e)
  }
}

if (Application.android) {
  // When activity is created or receives a new intent
  Application.android.on(AndroidApplication.activityNewIntentEvent, (args: any) => {
	handleAndroidIntent(args.activity)
  })

  // Handle the case when the app is launched via an Intent (initial activity start)
  Application.android.on(AndroidApplication.activityStartedEvent, (args: any) => {
	handleAndroidIntent(args.activity)
  })
}

Application.run({ moduleName: 'app-root' })

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
