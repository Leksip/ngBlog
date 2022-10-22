import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/interfaces";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup
  submitted = false
  alertMessage: string

  constructor(public auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // если значение query параметра loginAgain(получаем его из гварда) - в переменную заносится сообщение
      if (params['loginAgain']) {
        this.alertMessage = 'Пожалуйста введите данный еще раз, время сессии истекло'
        this.alertService.danger('Время сессии истекло')
      }
      // если значение query параметра authFailed(получаем из интерсептора)
      else if (params['authFailed']){this.alertMessage = 'Cессия истекла, введите данные заново'}
      this.alertService.danger('Время сессии истекло')
    })

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) { // доп проверка на валидность
      return
    }
    // создал переменную с данными пощльзователя
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }
    this.auth.login(user).subscribe(
      () => {
        this.form.reset()
        this.router.navigate(['/admin', 'dashboard'])
        this.submitted = false
      }, () => this.submitted = false // при ошибке возвращает переменную в значение false
    )

  }
}
