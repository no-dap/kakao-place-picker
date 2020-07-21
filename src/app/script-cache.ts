import { LatLng } from './interface';

export class ScriptCache {
  private loaded: string[];
  private readonly failed: string[];
  private pending: string[];

  constructor() {
    this.loaded = [];
    this.failed = [];
    this.pending = [];
  }

  public load(scripts: string[], callback: (...args) => void, ...args): void {
    for (const src of scripts) {
      this.loadSrc(src).then((resolve) => {
        callback(...args);
      });
    }
  }

  /**
   * scriptTag 가 load 됐을 때 handle
   */
  private loadSrc(src: string): Promise<any> {
    if (this.loaded.indexOf(src) >= 0) {
      return Promise.resolve(src);
    }

    this.pending.push(src);
    return this.scriptTag(src)
      .then(() => {
        this.loaded.push(this.pending.pop());
      })
      .catch((err) => {
        this.failed.push(this.pending.pop());
        console.log(this.failed);
      })
  }

  /**
   * 받은 src 로 script tag 를 생성 하고, 해당 tag 를 resolve 합니다.
   */
  private scriptTag(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let resolved = false,
        errored = false;
      const tag: HTMLScriptElement = document.createElement('script');
      const head: HTMLElement = document.head;

      tag.type = 'text/javascript';
      tag.async = false; // Load in order

      const handleLoad = () => {
        resolved = true;
        resolve(src);
      };
      const handleReject = () => {
        errored = true;
        reject(src);
      };

      tag.addEventListener('load', handleLoad);
      tag.addEventListener('error', handleReject);
      tag.src = src;
      head.appendChild(tag);
      return tag;
    });
  }
}