import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {MainLayoutComponent} from "./shared/components/main-layout/main-layout.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {PostPageComponent} from "./post-page/post-page.component";

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/', pathMatch: 'full'}, //переход на страницу home-page если путь полностью совпадает
      {path: '', component: HomePageComponent},
      {path: 'post/:id', component: PostPageComponent}
    ]
  },
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)} // добавляем роут на страницу с админкой( через отдельно созданный для нее модуль с роутами и тд)
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})], // добавили стратегию загрузки модулей для загрузки компонента admin  в фоне
  exports: [RouterModule]
})
export class AppRouting {
}
