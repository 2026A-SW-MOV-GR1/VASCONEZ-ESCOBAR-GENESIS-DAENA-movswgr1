import { EventData, Page, Frame, Observable } from '@nativescript/core'

export function navigatingTo(args: EventData) {
  const page = <Page>args.object
  const context = (args as any).context || {}

  const vm = new Observable()
  vm.set('receivedText', context.receivedText || '—')
  vm.set('imageSrc', context.imageSrc || '')
  vm.set('status', context.status || 'Esperando contenido entrante...')

  vm.set('goBack', () => {
    Frame.topmost()?.goBack()
  })

  page.bindingContext = vm
}

