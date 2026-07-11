import { EventData, Page, View } from '@nativescript/core';

export function onLoaded(args: EventData) {
  const page = <Page>args.object;
  const container = <View>page.getViewById('logoContainer');
  
  if (container) {
    container.opacity = 0;
    container.scaleX = 0.6;
    container.scaleY = 0.6;
    
    container.animate({
      opacity: 1,
      scaleX: 1.0,
      scaleY: 1.0,
      duration: 1200,
      curve: 'easeOut'
    }).then(() => {
      // Auto-navigate to City Selection after a short delay
      setTimeout(() => {
        page.frame.navigate({
          moduleName: 'views/city-select/city-select-page',
          clearHistory: true,
          transition: {
            name: 'fade',
            duration: 600
          }
        });
      }, 1200);
    });
  }
}
