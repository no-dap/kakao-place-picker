export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface kakaoLatLngOptions {
  center: any;
  level: number;
}

export interface Place {
  addressName: string;
  categoryGroupCode: string;
  categoryGroupName: string;
  categoryName: string;
  distance: string;
  id: string;
  lat: string;
  lng: string;
  phone: string;
  placeName: string;
  placeUrl: string;
  roadAddressName: string;
  x: string;
  y: string;
  region_depth1?: string;
  region_depth2?: string;
  region_depth3?: string;
  region_depth4?: string;
}
