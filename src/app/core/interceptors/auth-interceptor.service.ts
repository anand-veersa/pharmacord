import {
  HttpErrorResponse,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';
@Injectable()
export class AuthInterceptor {
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const headers: any = {
      ClientId: environment.clientId,
      ProgramId: environment.programId,
    };
    if (
      this.authService.isLoggedIn() &&
      !req.url.includes('account/refreshToken')
    ) {
      const { AccessToken } = JSON.parse(
        this.localStorageService.getItem('userData')
      );
      headers.Authorization = `Bearer ${AccessToken}`;
    }
    const modifiedRequest = req.clone({ setHeaders: headers });

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error instanceof HttpErrorResponse &&
          [401].includes(error.status) &&
          !modifiedRequest.url.includes('account/refreshToken') &&
          !modifiedRequest.url.includes('logout')
        ) {
          return this.handleAuthError(modifiedRequest, next);
        } else if ([401, 403].includes(error.status)) {
          this.authService.logoutWithoutToken();
        }
        return throwError(() => error.status);
      })
    );
  }

  private handleAuthError(request: HttpRequest<any>, next: HttpHandler) {
    const userData = JSON.parse(this.localStorageService.getItem('userData'));
    return this.authService
      .refreshTokens(userData.UserName, userData.RefreshToken)
      .pipe(
        switchMap((res: any) => {
          userData.AccessToken = res.Payload.AccessToken;
          userData.RefreshToken = res.Payload.RefreshToken;
          this.localStorageService.setItem(
            'userData',
            JSON.stringify(userData)
          );
          const modifiedRequest = request.clone({
            headers: request.headers.set(
              'Authorization',
              `Bearer ${res.Payload.AccessToken}`
            ),
          });
          return next.handle(modifiedRequest);
        }),
        catchError(err => {
          this.sharedService.notify(
            'error',
            'Session timed out. Please try again'
          );
          this.authService.logoutWithoutToken();
          return throwError(() => err.status);
        })
      );
  }
}
