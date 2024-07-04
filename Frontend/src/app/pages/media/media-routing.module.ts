import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaComponent } from './media.component';
import { MediaFormComponent } from './media-form/media-form.component';

const routes: Routes = [{ path: '', component: MediaComponent, children: [
 {path: 'createMedia', component: MediaFormComponent},
 {path: 'createMedia/:id', component: MediaFormComponent}
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }
