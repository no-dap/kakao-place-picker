import { kakaoLatLngOptions, LatLng } from './app/interface';
import { ScriptCache } from './app/script-cache';
import './global.less';

declare var kakao;

export default class KaKaoPlacePicker {
  // map container
  private container: HTMLElement;
  public map: any;

  constructor() {

  }

  public init(appKey: string, containerId: string, latLng: LatLng): void {
    this.setKakaoScript(appKey, containerId, latLng);
  }

  private setKakaoScript = (appKey: string, containerId: string, latLng: LatLng): void => {
    const cache = new ScriptCache();
    cache.load([`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services,drawing&autoload=false`],
      this.initMap,
      containerId,
      latLng);
  };

  public initMap = (containerId: string, latLng: LatLng): void => {
    this.container = document.getElementById(containerId);
    kakao.maps.load((): void => {
      const options: kakaoLatLngOptions = {
        center: new kakao.maps.LatLng(latLng.latitude, latLng.longitude),
        level: 3
      };
      this.map = new kakao.maps.Map(this.container, options);
    });
  };
}
