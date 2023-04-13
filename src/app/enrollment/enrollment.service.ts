import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class EnrollmentService {
  public selectedMedicine = new BehaviorSubject<string>('');
  public medicineCases = new BehaviorSubject<any[]>([]);
  public submitFormInitiated = new BehaviorSubject<boolean>(false);
  public cases = new BehaviorSubject<any[]>([]);
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

  public getPrescriberCases(
    prescriberId: number,
    userPortalPkId: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrl}provider/cases/prescriber?prescriberIds=${prescriberId}&masterPortalAccountId=${userPortalPkId}`
    );
  }

  public getCaseDetails(caseId: string): Observable<any> {
    return this.http
      .get<any>(`${environment.baseUrl}cases/${caseId}`)
      .pipe(catchError(this.handleError));
  }

  public getCaseDoc(url: string): Observable<any> {
    return this.http
      .get(url, { responseType: 'blob' })
      .pipe(map(response => new Blob([response], { type: 'application/pdf' })));
  }

  public deleteFacility(deletePayload: any): Observable<any> {
    return this.http
      .put(
        `${environment.baseUrl}portal/account/deleteFacility/${this.authService.user.portalAccountPkId}`,
        deletePayload
      )
      .pipe(catchError(this.handleError));
  }

  public updateFacility(addFacilityPayload: any): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}account/update`, addFacilityPayload)
      .pipe(catchError(this.handleError));
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
    this.authService.userFullName.next(`${FirstName} ${LastName}`);
    this.authService.user = {
      firstName: FirstName,
      lastName: LastName,
      username: Username,
      prescribers: Providers,
      email: UserDetails.Email,
      phone: UserDetails.Phone,
      fax: UserDetails.Fax,
      portalAccountPkId: PortalAccountPkId,
      role: Role,
      userDetails: UserDetails,
    };
  }

  private handleError(errorRes: number): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes) {
      return throwError(() => errorMessage);
    }
    switch (errorRes) {
      case 401:
        errorMessage = 'Session timed out. Please try again';
        break;
      case 403:
        errorMessage = 'Session timed out. Please try again';
        break;
      case 404:
        errorMessage = 'No data found';
        break;
      case 500:
        errorMessage = 'Something went wrong. Please try again';
        break;
    }
    return throwError(() => errorMessage);
  }
}
