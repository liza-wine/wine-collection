import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  public lang = signal<string>(localStorage.getItem('lang') ?? 'ka');

  public changeLang(lang: 'ka' | 'en') {
    this.lang.set(lang);
    localStorage.setItem('lang', lang);
  }
}
