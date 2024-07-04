import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/core/services/content.service';
import { ToastrService } from 'ngx-toastr';
import { EventserviceService } from 'src/app/core/services/eventservice.service';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent {
  constructor(private _eventService : EventserviceService, private toastr : ToastrService, private route : ActivatedRoute, private _authService : AuthService){
    
  }
  event!: any;
  isAdmin : boolean = this._authService.isAdmin();


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this._eventService.getEvent(id).subscribe(
        (data : any) => {
          console.log(data)
          this.event = data.result
        },
        (error : any) => console.error('Error fetching article', error)
      );
    }
  }
}
  