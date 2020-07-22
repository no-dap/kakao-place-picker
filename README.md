# kakao-place-picker
kakao API를 기반으로 원하는 장소를 검색하여 해당 장소의 정보를 가져올 수 있는 프로젝트 입니다.  
해당 프로젝트는 web framework에서 iframe으로 implement 할 것을 상정하여 작성되었습니다.  

## Dependency
rxjs==6.6.0  
ts-node==8.10.2

## Installation
1. [Install node.js](https://nodejs.org)  
2. Run script below
```shell
npm install
npm run-script build
```

## How to use
#### Serve this project at static storage
#### In parent project,
- in html template
  ```html
  <iframe id="kakao-place-picker" src="YOUR_STATIC_STORAGE_URL"></iframe>
  ```
- in JS (or TS)
  ```typescript
  window.onmessage = (event: KakaoPlacePickerEvent) => {
    switch (event.type) {
      case 'backButtonClicked':
        // Do something on back button clicked
        break;
      case 'placeSelected':
        const data: PlaceData = event.data;
        // Do something on place selected
        break;
    }
  }
  
  // return data interface
  interface KakaoPlacePickerEvent {
    type: string;
    data: PlaceData;
  }
  
  interface PlaceData {
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
  ```
#### in current project,
- in template (See : index.html)
  ```html
  <script src="dist/KakaoPlacePicker.min.js"></script>
  <script>
      const kakaoPlacePicker = new KakaoPlacePicker.default;
      kakaoPlacePicker.init('Your app key',
          'kakao-place-picker-map-container',
          {longitude: 'initial longitude', latitude: 'initial latitude'});
  </script>
  ```
