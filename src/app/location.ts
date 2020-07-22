import { Observable, Subject } from 'rxjs';
import { ResponseAdaptor } from './adaptor';
import { EventListener } from './event-listener';
import { Place } from './interface';
import { Renderer } from './renderer';

declare const kakao: any;

export class Location {
  private renderer: Renderer;
  private responseAdaptor: ResponseAdaptor;

  // subjects
  private placeListResult: Subject<Place[]>;

  // data
  public place: Place | null;
  public activeMarker: any;
  private markerList: any[] = [];
  private placeList: Place[];
  private readonly map: any;

  // icon
  private iconOn: any;
  private iconOff: any;

  constructor(private eventListener: EventListener,
              private kakaoMap: any) {
    this.map = kakaoMap;
    this.placeListResult = new Subject<Place[]>();
    this.initClasses();
    this.setIcon();
    this.flushLocation();
    this.searchLocation();
  }

  private initClasses(): void {
    this.renderer = new Renderer(this, this.map);
    this.responseAdaptor = new ResponseAdaptor();
  }

  /**
   * icon 을 가져와 MarkerImage object  생성 합니다.
   */
  private setIcon(): void {
    this.iconOn = new kakao.maps.MarkerImage(
      '/kakao-place-picker/src/assets/icon/marker_on.png',
      new kakao.maps.Size(30, 42));
    this.iconOff = new kakao.maps.MarkerImage(
      '/kakao-place-picker/src/assets/icon/marker_off.png',
      new kakao.maps.Size(30, 42));
  }

  public getPlaceListObservable(): Observable<Place[]> {
    return this.placeListResult.asObservable();
  }

  /**
   * 현재의 장소 정보를 초기화 합니다.
   */
  private flushLocation(): void {
    for (let i = 0; i < this.markerList.length; i++) {
      this.markerList[i].setMap(null);
    }

    this.markerList = [];
    this.placeList = [];
    this.place = null;
    this.activeMarker = null;
  }

  public flushActiveMarker(): void {
    this.place = null;
    this.activeMarker.setImage(this.iconOff);
  }

  public setPlace(place: Place, idx: number): void {
    if (this.activeMarker && this.activeMarker.setImage) {
      this.activeMarker.setImage(this.iconOff);
    }

    this.place = place;
    this.activeMarker = this.markerList[idx];
    this.markerList[idx].setImage(this.iconOn);
    this.map.setLevel(4);
    this.map.setCenter(new kakao.maps.LatLng(this.place.lat, this.place.lng));
  }

  /**
   * 지도에 marker 를 추가 합니다.
   */
  private addMaker(place: Place): void {
    const marker = new kakao.maps.Marker({
      clickable: true,
      map: this.map,
      position: new kakao.maps.LatLng(place.lat, place.lng),
      image: this.iconOff
    });

    this.markerList.push(marker);
    this.placeList.push(place);

    kakao.maps.event.addListener(marker, 'click', () => {
      if (this.activeMarker) {
        this.activeMarker.setImage(this.iconOff);
      }

      this.place = place;
      marker.setImage(this.iconOn);
      this.activeMarker = marker;
    });
  }

  /**
   * search input changed 를 subscribe 해서 변화가 있을 때 해당 input 값을 통해 장소를 검색 하고
   * marker 를 추가 합니다.
   */
  private searchLocation(): void {
    this.eventListener.getSearchInputChanged().subscribe((input: string) => {
      const placeService = new kakao.maps.services.Places();
      this.flushLocation();

      /**
       * Request keyword search with input term
       */
      placeService.keywordSearch(input, (res: Place[], status: string) => {
        res = res.map(data => this.responseAdaptor.adapt(data));

        if (status === kakao.maps.services.Status.OK) {
          const bounds = new kakao.maps.LatLngBounds();

          for (const data of res) {
            data.lat = data.y;
            data.lng = data.x;
            this.addMaker(data);
            bounds.extend(new kakao.maps.LatLng(data.lat, data.lng));
          }
          // publish this.placeList for renderer (render bottom place picker)
          this.placeListResult.next(this.placeList);

          this.map.setBounds(bounds);
        }
      });
    });
  }

  public insertRegion(callback) {
    const geoCoder = new kakao.maps.services.Geocoder();

    geoCoder.coord2RegionCode(this.place.lng, this.place.lat, (res, status) => {
      if (status === kakao.maps.services.Status.OK) {
        this.place.region_depth1 = res[1].region_1depth_name;
        this.place.region_depth2 = res[1].region_2depth_name;
        this.place.region_depth3 = res[1].region_3depth_name;
        this.place.region_depth4 = res[1].region_4depth_name;
      }

      callback(this.place);
    });
  }
}