import { HttpHandler, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { environment } from 'src/environments/environment';
@Injectable()
export class AuthInterceptor {
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedRequest = req.clone({
      setHeaders: { ClientId: environment.clientId },
    });
    if (this.authService.isLoggedIn()) {
      const { AccessToken } = JSON.parse(
        this.localStorageService.getItem('userData')
      );
      modifiedRequest.headers.append('Authorization', `Bearer ${AccessToken}`);
    }
    return next.handle(modifiedRequest);
  }
}
