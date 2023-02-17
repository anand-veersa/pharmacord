import { Injectable } from '@angular/core';
import { LocalStorageService } from '../shared/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private localStorage: LocalStorageService) {}
  
  public isLoggedIn(): boolean {
    return this.localStorage.getItem('accessToken');
  }
  
  public getUserRole(): string | null {
    return this.localStorage.getItem('userRole');
  }
}
