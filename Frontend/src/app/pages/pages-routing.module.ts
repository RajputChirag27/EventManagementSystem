import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { AuthGuard } from '../core/guards/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard], // Main component
    children: [
      // { path: '', component: HomepageComponent, pathMatch: 'full'}, // Default route
      { path: '', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      {path: 'content', loadChildren: () => import('./content/content.module').then(m=> m.ContentModule)},
      { path: 'media', loadChildren: () => import('./media/media.module').then(m => m.MediaModule) },
      { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) },
      // { path: 'home', component: HomepageComponent }, // Home route
    ]
  },
 
];
@NgModule({
  imports: [RouterModule.forChild(routes),LayoutsModule],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
