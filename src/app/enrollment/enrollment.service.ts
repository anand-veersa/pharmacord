import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class EnrollmentService {
  public selectedMedicine = new Subject<string>();
  public medicineCases = new BehaviorSubject<any[]>([]);
  public cases = new Subject<any[]>();
  constructor(private http: HttpClient, private authService: AuthService) {}

  public getAccountInfo(username: string): Observable<any> {
    return this.http
      .get(
        `${environment.baseUrl}account/${username}?ShowAccountIndicator=True`
      )
      .pipe(
        catchError(this.handleError),
        tap(res => this.handleAccountInfo(res))
      );
  }

  public getProviderCases(
    providerId: number,
    userPortalPkId: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrl}provider/cases/prescriber?prescriberIds=${providerId}&masterPortalAccountId=${userPortalPkId}`
    );
  }

  private handleAccountInfo(data: any) {
    const {
      FirstName,
      LastName,
      Username,
      Providers,
      UserDetails,
      PortalAccountPkId,
      Role,
    } = data.Payload;
    this.authService.user = {
      firstName: FirstName,
      lastName: LastName,
      username: Username,
      providers: Providers,
      email: UserDetails.Email,
      phone: UserDetails.Phone,
      fax: UserDetails.Fax,
      portalAccountPkId: PortalAccountPkId,
      role: Role,
    };
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.status) {
      return throwError(errorMessage);
    }
    switch (errorRes.status) {
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
    return throwError(errorMessage);
  }
}
