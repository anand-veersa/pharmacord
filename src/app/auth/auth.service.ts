import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
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
    prescribers: any[];
    portalAccountPkId: number;
    role: any;
    userDetails: object[];
  };
  public userName = new BehaviorSubject<string>('');

  public publicRoutes: string[] = [
    '/login',
    '/reset-password',
    '/reset-username',
  ];

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

  public logout(): Observable<any> {
    const { UserName } = JSON.parse(this.localStorage.getItem('userData'));
    return this.http.post<any>(`${environment.baseUrl}account/logout`, {
      Email: UserName,
    });
  }

  public logoutWithoutToken() {
    this.localStorage.clear();
    this.router.navigate(['/login']);
  }

  private handleAuthentication(data: any) {
    const {
      AccessToken,
      HasSecurityQuestionAnswere,
      IsFirstTimeLogin,
      RefreshToken,
    } = data.Payload;
    const UserName = data.Parameters.Email;
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
  }): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}portal/account/forgotUsername`, data)
      .pipe(catchError(this.handleError));
  }

  public getSecurityQuestions(data: {
    Email: string;
    Username: string;
  }): Observable<any> {
    return this.http
      .get(
        `${environment.baseUrl}securityQuestions?userName=${data.Username}&email=${data.Email}`
      )
      .pipe(catchError(this.handleError));
  }

  public resetPassword(data: any): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}portal/account/resetPassword`, data)
      .pipe(catchError(this.handleError));
  }

  public getProviderDetails(data: {
    NPI: number;
    FirstName: string;
    LastName: string;
  }): Observable<any> {
    return this.http
      .get(
        `${environment.baseUrl}provider/${data.NPI}/${data.FirstName}/${data.LastName}`
      )
      .pipe(catchError(this.handleError));
  }

  public validateUsername(validateUsernamePayload: string): Observable<any> {
    return this.http
      .get(`${environment.baseUrl}account/${validateUsernamePayload}/inuse`)
      .pipe(catchError(this.handleError));
  }

  public accountRegistration(data: any): Observable<any> {
    console.log(data, 'data in auth service');
    return this.http
      .post(`${environment.baseUrl}account`, data)
      .pipe(catchError(this.handleError));
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
