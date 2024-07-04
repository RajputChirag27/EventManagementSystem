import { Component } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAuth } from 'src/app/core/interfaces/IAuth';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;
  roles: string[] = ['Admin', 'User', 'Editor'];
  constructor(private fb: FormBuilder, private _userService: UserService, private toastr : ToastrService, private router : Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      profilePicture: ["https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png"]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData : IAuth = this.signupForm.value;
      console.log(formData)
      this._userService.createUser(formData).subscribe(
        (response : any) => {
          this.toastr.info('User created successfully', 'Success!!');
          console.log('User created successfully', response);
          this.router.navigate(['/authentication/login'])
        },
        (error : any) => {
          console.error('Error creating user', error);
          if(error.error.errors){
            this.toastr.error(error.error.errors[0].message, 'Error!!');
          } else
          this.toastr.error(`${error.error.error}`, 'Sign In Error!!');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  get f() {
    return this.signupForm.controls;
  }
}