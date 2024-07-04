import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { ContenteditComponent } from './contentedit/contentedit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewPageComponent } from './view-page/view-page.component';
import { EventComponent } from './event/event.component';


@NgModule({
  declarations: [
    ContentComponent,
    ContenteditComponent,
    DashboardComponent,
    ViewPageComponent,
    EventComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    ReactiveFormsModule,
    QuillModule,
    AgGridModule
  ]
})
export class ContentModule { }
