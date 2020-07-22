import { Observable, Subject } from 'rxjs';
import { Location } from './location';

export class EventListener {
  private location: Location;

  // Elements
  private searchInput: HTMLElement;
  private searchBtn: HTMLElement;
  private backBtn: HTMLElement;

  // Subjects
  private searchInputChange: Subject<string>;

  constructor(map: any) {
    this.initializeElements();
    this.initializeSubjects();

    this.addDefaultEventListeners();

    this.location = new Location(this, map);
  }

  initializeElements(): void {
    this.searchInput = document.getElementById('searchInput');
    this.searchBtn = document.getElementById('searchBtn');
    this.backBtn = document.getElementById('backBtn');
  }

  initializeSubjects(): void {
    this.searchInputChange = new Subject<string>();
  }

  addDefaultEventListeners(): void {
    this.onClickBackButton();
    this.onKeyUpSearchInput();
  }

  getSearchInputChanged(): Observable<string> {
    return this.searchInputChange.asObservable();
  }

  /**
   * 상단 back button click
   */
  onClickBackButton(): void {
    this.backBtn.addEventListener('click', () => {
      window.top.postMessage({event: 'backButtonClicked'}, '*');
    });
  }

  /**
   * 상단 장소 검색 key up
   */
  onKeyUpSearchInput(): void {
    this.searchInput.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const searchInput = event.target as HTMLElement;
        this.searchInputChange.next((event.target as HTMLInputElement).value);
        searchInput.blur();
      }
    });
  }
}