import { EventData, Page, Observable, Frame, ApplicationSettings } from '@nativescript/core';
import { MockDataService } from '../../services/mock-data.service';

export class CitySelectViewModel extends Observable {
  private _selectedCityText = 'Ciudad';
  private _isCitySelected = false;
  private _isModalVisible = false;
  private _cities: string[] = [];

  constructor() {
    super();
    // Load cities from MockDataService
    const cityList = MockDataService.getCities();
    this._cities = cityList.map(c => c.name);

    // Check if a city was previously selected
    const savedCity = ApplicationSettings.getString('selectedCity');
    if (savedCity) {
      this._selectedCityText = savedCity;
      this._isCitySelected = true;
    }
  }

  get selectedCityText(): string {
    return this._selectedCityText;
  }

  set selectedCityText(value: string) {
    if (this._selectedCityText !== value) {
      this._selectedCityText = value;
      this.notifyPropertyChange('selectedCityText', value);
    }
  }

  get isCitySelected(): boolean {
    return this._isCitySelected;
  }

  set isCitySelected(value: boolean) {
    if (this._isCitySelected !== value) {
      this._isCitySelected = value;
      this.notifyPropertyChange('isCitySelected', value);
    }
  }

  get isModalVisible(): boolean {
    return this._isModalVisible;
  }

  set isModalVisible(value: boolean) {
    if (this._isModalVisible !== value) {
      this._isModalVisible = value;
      this.notifyPropertyChange('isModalVisible', value);
    }
  }

  get cities(): string[] {
    return this._cities;
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
  }

  onModalClick(args: any) {
    // Prevent event bubbling to overlay background tap handler
    if (args.object && args.object.android) {
      // Android specific handle if needed
    }
  }

  _doSelectCity(cityName: string) {
    this.selectedCityText = cityName;
    this.isCitySelected = true;
    this.isModalVisible = false;
    ApplicationSettings.setString('selectedCity', cityName);
  }

  onContinue() {
    // Navigate to cartelera
    Frame.topmost().navigate({
      moduleName: 'views/cartelera/cartelera-page',
      clearHistory: true,
      transition: {
        name: 'slide',
        duration: 400
      }
    });
  }
}

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new CitySelectViewModel();
}

// Module-level export — resuelve el tap del Repeater de ciudades
export function selectCity(args: any) {
  const page = <Page>Frame.topmost().currentPage;
  const vm = <CitySelectViewModel>page.bindingContext;
  // bindingContext del ítem es el string $value (ciudad)
  const cityName = args.object.bindingContext as string;
  if (cityName && typeof cityName === 'string') {
    vm._doSelectCity(cityName);
  }
}
