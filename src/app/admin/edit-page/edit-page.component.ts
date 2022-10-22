import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {PostsService} from "../../shared/posts.service";
import {Subscription, switchMap} from "rxjs";
import {Post} from "../../shared/interfaces";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  post: Post
  submitted = false
  uSub: Subscription

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postsService.getById(params['id'])
      })
    ).subscribe((post: Post) => {
      this.post = post
      this.form = this.fb.group({
        title: [post.title, Validators.required],
        text: [post.text, Validators.required]
      })
    })
  }

  ngSubmit() {
    if (this.form.invalid) {
      return
    }
    this.submitted = true
    this.uSub = this.postsService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title
    }).subscribe(() => {
      this.submitted = false
      this.router.navigate(['/admin', 'dashboard'])
      this.alertService.success('Пост успешно отредактирован')
    })
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }
}
