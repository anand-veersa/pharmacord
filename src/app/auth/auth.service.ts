import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, tap, throwError } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { AppConstants } from '../constants/app.constants';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user!: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: number;
    fax: string;
    providers: any[];
    portalAccountPkId: number;
    role: any;
  };
  public publicRoutes: string[] = [
    '/login',
    '/reset-password',
    '/reset-username',
  ];
  public resHeaders: HttpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('ClientId', 'V5G18lkyJw7nBL3g5RMBK5fgXSf4FFeH')
    .set('ProgramId', '500034');
  constructor(
    private localStorage: LocalStorageService,
    private http: HttpClient,
    private appConstants: AppConstants,
    private router: Router
  ) {}

  public isLoggedIn(): boolean {
    return !!JSON.parse(this.localStorage.getItem('userData'));
  }

  public getUserRole(): string | null {
    return this.localStorage.getItem('userRole');
  }

  public login(data: { Email: string; Password: string }) {
    return this.http.post(`${environment.baseUrl}account/login`, data).pipe(
      catchError(this.handleError),
      tap(res => this.handleAuthentication(res))
    );
  }

  public logout() {
    const { UserName } = JSON.parse(this.localStorage.getItem('userData'));
    return this.http
      .post<any>(`${environment.baseUrl}account/logout`, { Email: UserName })
      .subscribe(res => this.logoutWithoutToken());
  }
  public logoutWithoutToken() {
    this.localStorage.clear();
    this.router.navigate(['/logout']);
  }

  private handleAuthentication(data: any) {
    const {
      AccessToken,
      HasSecurityQuestionAnswere,
      IsFirstTimeLogin,
      RefreshToken,
    } = data.Payload;
    const UserName = data.Parameters.Email;
    const expirationDate = new Date(
      new Date().getTime() + this.appConstants.TOKEN_EXPIRY_DURATION * 1000
    );
    this.localStorage.setItem(
      'userData',
      JSON.stringify({
        AccessToken,
        HasSecurityQuestionAnswere,
        IsFirstTimeLogin,
        RefreshToken,
        UserName,
      })
    );
  }

  public resetUsername(data: {
    Email: string;
    FirstName: string;
    LastName: string;
  }) {
    return this.http.post(
      `${environment.baseUrl}portal/account/forgotUsername`,
      data,
      {
        headers: this.resHeaders,
      }
    );
  }

  public getSecurityQuestions(data: { Email: string; Username: string }) {
    return this.http.get(
      `${environment.baseUrl}securityQuestions?userName=${data.Username}&email=${data.Email}`,
      {
        headers: this.resHeaders,
      }
    );
  }

  private handleError(errorRes: number) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes) {
      return throwError(() => errorMessage);
    }
    switch (errorRes) {
      case 400:
        errorMessage = 'The supplied credentials are incorrect';
        break;
      case 403:
        errorMessage = 'The supplied credentials are incorrect';
        break;
      case 500:
        errorMessage = 'Something went wrong. Please try again';
        break;
    }
    return throwError(() => errorMessage);
  }
}
