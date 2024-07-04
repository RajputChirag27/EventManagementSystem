import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [{ path: '', component: UserComponent, 
children: [
  {path: '', component: HomepageComponent, pathMatch: 'full'},
  {path: 'home', component: HomepageComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'about', component: AboutComponent},

]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
