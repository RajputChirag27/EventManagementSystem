import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { IAuth } from 'src/app/core/interfaces/IAuth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  myForm!: FormGroup;
  // isLoggedIn : boolean = false;
  @Output() loginEvent = new EventEmitter<any>();

  constructor(
    private _authService: AuthService,
    private router: Router,
    private toastr : ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required],
      rememberMe: [false, Validators.required],
    });
  }

  onSubmit() {
    const { email, password, rememberMe } = this.myForm.value; // Destructure email and password from form value
    console.log( { email, password, rememberMe });
      const result =  this._authService.login({email, password} as Partial<IAuth> ).subscribe(
      (response: any) => {
        // Assuming setToken function is correct in AuthService
        console.log(response)
        this.toastr.info(`${response.result.user.username}`, `Welcome!`,{
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
        });
          this._authService.setToken(response.result.token);
          // this._authService.setRole(response.result.user.role)
          this.router.navigate(['/pages/home']);
      },
      (error : any) => {
        // console.log(error.error.error)
        this.toastr.error(`${error.error.error}`, `Error!`,{
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
        });
      }
    );
    // if(result){
    //   this.loginEvent.emit(true)
    // }else{
    //   this.loginEvent.emit(false)
    // }
  }
}
