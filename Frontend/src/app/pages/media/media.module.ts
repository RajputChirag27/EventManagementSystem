import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { MediaComponent } from './media.component';
import { MediaFormComponent } from './media-form/media-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    MediaComponent,
    MediaFormComponent
  ],
  imports: [
    CommonModule,
    MediaRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class MediaModule { }
