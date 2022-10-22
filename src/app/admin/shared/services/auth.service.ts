import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {

  public error$: Subject<string> = new Subject<string>() // создаем переменную куда будут занситься ошибки

  constructor(private http: HttpClient) {
  }

// получаем токен и проверяем не истекло ли время его хранения
  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'))
    if (new Date() > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

//Отправляем данные пользователя на сервер
  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user).pipe(
      tap(this.setToken),
      catchError(this.handleError.bind(this)) //для вывода ошибок
    )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

//метод для проверки на наличие ошибки
  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такого email нет')// задает значение error
        break
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль')
        break
    }
    return throwError(error)
  }

//создаем хранение токена
  private setToken(response: FbAuthResponse | null) {
    if (response) {
      console.log(response)
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else localStorage.clear()
  }
}
