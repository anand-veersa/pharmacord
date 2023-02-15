import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() {}
  
  public getItem(key: string): any {
    return !!localStorage.getItem(key);
  }
  
  public setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }
  
  public clear(): void {
    localStorage.clear();
  }
}
