import { EventData, Page, Frame, Observable, Application, ImageSource } from '@nativescript/core'
// Android global (available at runtime on Android). Declare for TypeScript.
declare const android: any
import { requestPermissions, takePicture, isAvailable as cameraAvailable } from '@nativescript/camera'

export function navigatingTo(args: EventData) {
  const page = <Page>args.object

  // Simple Observable view-model for this screen. No Intents logic yet - only UI structure and navigation.
  const vm = new Observable()
  vm.set('phone', '')
  vm.set('photoSrc', '')

  // Real handler for "Iniciar Dial" using Android Intent ACTION_DIAL
  vm.set('onStartDial', () => {
    const phone = vm.get('phone') || ''
    if (!phone || phone.trim().length === 0) {
      console.log('No phone number entered')
      return
    }

    try {
      if (Application.android) {
        const uri = android.net.Uri.parse('tel:' + phone.trim())
        const intent = new android.content.Intent(android.content.Intent.ACTION_DIAL, uri)
        const activity = Application.android.foregroundActivity || Application.android.startActivity
        activity.startActivity(intent)
      } else {
        console.log('Dial intent is only available on Android')
      }
    } catch (err) {
      console.error('Error starting dial intent:', err)
    }
  })

  // Real handler for "Tomar Foto" using @nativescript/camera
  vm.set('onTakePhoto', async () => {
    try {
      if (!cameraAvailable()) {
        console.log('Camera not available on this device')
        return
      }

      // Request runtime permissions when needed
      await requestPermissions()

      // Take picture with modest size for a thumbnail
      const imageSource: ImageSource = await takePicture({ width: 800, height: 800, keepAspectRatio: true, saveToGallery: true })
      if (imageSource) {
        // Set the ImageSource directly as binding value; NativeScript Image can accept ImageSource
        vm.set('photoSrc', imageSource)
      }
    } catch (err) {
      console.error('Error taking picture:', err)
    }
  })

  // Navigate to the Incoming Intents page. We pass an empty context for now.
  vm.set('openIncoming', () => {
    Frame.topmost()?.navigate({ moduleName: 'incoming-page', context: { receivedText: '', imageSrc: '', status: 'Listo para recibir' } })
  })

  page.bindingContext = vm
}
