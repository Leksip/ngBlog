import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable,  throwError} from 'rxjs';
import {AuthService} from "../admin/shared/services/auth.service";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,
              private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.auth.isAuthenticated()) { //если токен присутствует и пользователь зарегистрирован
      request = request.clone({
        setParams: {auth: this.auth.token}
      })
    }
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('[Interceptor error]', error)
          if (error.status === 401) {
            this.auth.logout()
            this.router.navigate(['/admin', 'login'],
              {
                queryParams: {
                  authFailed: true
                }
              })
          }
          return throwError(error)
        })
      );
  }
}
