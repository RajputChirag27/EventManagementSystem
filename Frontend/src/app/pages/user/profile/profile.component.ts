import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  defaultProfile : string = 'https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png'
  result! : any
  constructor(private readonly _userService : UserService) {
  }

  ngOnInit(){
    this._userService.getUserDetails().subscribe((res : any) => {this.result = res.result}, (error : any) =>{
      console.error('Error fetching user profile:', error);
    });
  }
}
