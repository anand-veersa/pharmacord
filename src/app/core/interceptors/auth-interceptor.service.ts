import { HttpHandler, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
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
    const headers: any = { ClientId: environment.clientId };
    if (this.authService.isLoggedIn()) {
      const { AccessToken } = JSON.parse(
        this.localStorageService.getItem('userData')
      );
      headers.Authorization = `Bearer ${AccessToken}`;
    }
    const modifiedRequest = req.clone({ setHeaders: headers });

    return next.handle(modifiedRequest).pipe(
      catchError(error => {
        if ([401, 403].includes(error.status)) {
          this.authService.logoutWithoutToken();
        }
        return throwError(() => error.status);
      })
    );
  }
}
