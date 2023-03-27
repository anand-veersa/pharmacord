import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from '../shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient, private sharedService: SharedService) {}

  public changePassword(data: any): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}portal/account/person/updatePassword`, data)
      .pipe(
        catchError(this.handleError),
        tap(res => this.handleToaster(res))
      );
  }

  public profileInformation(data: any): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}portal/account/person/update`, data)
      .pipe(catchError(this.handleError));
  }

  private handleToaster(response: any) {
    const msg = response.Errors[0].Message;
    if (msg.indexOf('New password matches a previous password') > -1) {
      this.sharedService.notify(
        'error',
        'You used this password recently. Please choose a different one'
      );
    } else if (
      msg.indexOf('New password matches current account password') > -1
    ) {
      this.sharedService.notify(
        'error',
        'New password matches current account password'
      );
    } else if (
      msg.indexOf('The username/password does not match error message') > -1
    ) {
      this.sharedService.notify('error', 'Entered wrong current password');
    }
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
      case 500:
        errorMessage = 'Something went wrong. Please try again';
        break;
    }
    return throwError(() => errorMessage);
  }
}
