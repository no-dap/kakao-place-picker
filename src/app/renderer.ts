import { Place } from './interface';
import { Location } from './location';
import { enumerate } from './utils';

export class Renderer {
  // classes
  private map: any;

  // elements
  private placePickerElement: HTMLElement;
  private placeListElement: HTMLElement;

  private placeInfoElement: HTMLElement;
  private placeInfoCloseElement: HTMLElement;
  private placeConfirmElement: HTMLElement;

  // properties
  private selectedPlaceIdx: number;

  constructor(private location: Location, private kakaoMap: any) {
    this.map = kakaoMap;

    this.initElements();
    this.addDefaultEventListener();
    this.location.getPlaceListObservable().subscribe((placeList: Place[]) => {
      this.renderPlaceList(placeList);
    });
  }

  private initElements(): void {
    this.placePickerElement = document.getElementById('placePicker');
    this.placeListElement = this.placePickerElement.querySelector('#placeList');
    this.placeInfoElement = this.placePickerElement.querySelector('#placeInfo');
    this.placeInfoCloseElement = this.placeInfoElement.querySelector('#placeInfoClose');
    this.placeConfirmElement = this.placeInfoElement.querySelector('#confirm');
  }

  private flushPlaceList(): void {
    this.placeListElement.innerHTML = '';
  }

  private togglePlaceList(show: boolean): void {
    if (show) {
      this.placeListElement.style.display = 'block';
    } else {
      this.placeListElement.style.display = 'none';
    }
  }

  private togglePlaceInfo(show: boolean): void {
    if (show) {
      this.placeInfoElement.style.display = 'block';
    } else {
      this.placeInfoElement.style.display = 'none';
    }
  }

  private addDefaultEventListener(): void {
    this.placeInfoCloseElement.addEventListener('click', () => {
      this.onClickInfoClose();
    });

    this.placeConfirmElement.addEventListener('click', () => {
      this.onClickConfirm();
    });
  }

  private renderInfoDetail(place: Place): void {
    (this.placeInfoElement.querySelector('#infoPlaceName') as HTMLDivElement).innerText = place.placeName;
    (this.placeInfoElement.querySelector('#infoCategoryName') as HTMLDivElement).innerText = place.categoryName;
    (this.placeInfoElement.querySelector('#infoRoadAddressName') as HTMLDivElement).innerText = place.roadAddressName;
    (this.placeInfoElement.querySelector('#infoPhone') as HTMLDivElement).innerText = place.phone;
  }

  private onClickPlaceItem(place: Place, idx: number): void {
    this.togglePlaceInfo(true);
    this.togglePlaceList(false);
    this.location.setPlace(place, idx);
    this.renderInfoDetail(place);
  }

  private onClickInfoClose(): void {
    this.togglePlaceInfo(false);
    this.togglePlaceList(true);
    this.location.flushActiveMarker();
  }

  private onClickConfirm(): void {
    this.location.insertRegion((data: Place) => {
      window.top.postMessage({ type: 'placeSelected', data }, '*');
    });
  }

  private static addPlaceItemContent(innerHTML: string, content: string): string {
    if (content !== "") {
      innerHTML += `<div class="content">${content}</div>`;
    }
    return innerHTML;
  }

  private renderPlaceItem(place: Place, idx: number): HTMLElement {
    const placeItemElement: HTMLElement = document.createElement('div');
    placeItemElement.classList.add('place-item');
    let innerHTML: string = `<div class="title">${place.placeName}</div>`;
    innerHTML = Renderer.addPlaceItemContent(innerHTML, place.roadAddressName);
    innerHTML = Renderer.addPlaceItemContent(innerHTML, place.categoryName);
    innerHTML = Renderer.addPlaceItemContent(innerHTML, place.phone);
    placeItemElement.innerHTML = innerHTML;

    placeItemElement.addEventListener('click', () => {
      this.onClickPlaceItem(place, idx);
    });

    return placeItemElement;
  }

  private renderPlaceList(placeList: Place[]): void {
    this.flushPlaceList();
    this.placePickerElement.classList.remove('hide');

    for (const { index: idx, value: place } of enumerate(placeList)) {
      this.selectedPlaceIdx = idx;
      const placeItem: HTMLElement = this.renderPlaceItem(place, idx);
      this.placeListElement.appendChild(placeItem);
    }
  }
}
