import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from "../../shared/posts.service";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "../shared/services/alert.service";


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts: Post[] = []
  pSub: Subscription
  dSub: Subscription
  searchStr = '';

  constructor(private postService: PostsService,
              private http: HttpClient,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.pSub = this.postService.getAll().subscribe(posts => {
      this.posts = posts
    })
  }

//Удаление поста
  remove(id: string) {
    this.dSub = this.postService.remove(id).subscribe(() =>
      this.posts = this.posts.filter(p => p.id != id))
    this.alertService.warning('Пост удален')
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }
    if (this.dSub) {
      this.dSub.unsubscribe()
    }
  }


}
