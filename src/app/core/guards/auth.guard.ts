import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SubmitEnrollmentComponent } from 'src/app/enrollment/pages/submit-enrollment/submit-enrollment.component';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad
{
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.validateAuthorization(route, state.url);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canDeactivate(
    component: SubmitEnrollmentComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.formInitiated) return true;
    let subject = new Subject<boolean>();
    component.openDialog();
    subject = component.exitSubject;
    return subject.asObservable();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  validateAuthorization(route: ActivatedRouteSnapshot, url: any) {
    const publicRoutes = this.authService.publicRoutes;
    if (!this.authService.isLoggedIn() && !publicRoutes.includes(url)) {
      this.router.navigate(['/login']);
      return false;
    }
    if (this.authService.isLoggedIn() && publicRoutes.includes(url)) {
      this.router.navigate(['enrollment/dashboard']);
      return false;
    }
    const userRole = this.authService.getUserRole();
    if (route.data['role'] && route.data['role'].indexOf(userRole) === -1) {
      this.router.navigate(['enrollment/dashboard']);
      return false;
    }
    return true;
  }
}

interface ComponentType<T = any> {
  new (...args: any[]): T;
}
