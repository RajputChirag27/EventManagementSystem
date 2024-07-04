import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {
  myForm !: FormGroup;
  otp! : any;
  otpShown : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private fb : FormBuilder, private _authService : AuthService, private toastr : ToastrService, private router : Router) {
    this.myForm = this.fb.group({
      email: ['',Validators.required],
    });
  }

  handleOtp(otp: string): void {
    this.otp = otp;
    console.log(this.otp)
    this._authService.verifyOtp(this.otp.toString()).subscribe((res :any)=>{
      console.log(res)
      if(res){
        this.toastr.info(`${res.result.user.username}`, `Welcome!`,{
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
        });
        this.otpShown.next(true);
        this.otpShown.complete(); 
        this._authService.setToken(res.result.token);
          this._authService.setRole(res.result.user.role)
          this.router.navigate(['/pages/home']);
      }
    }, (err: any)=>{
      this.toastr.error(`${err.error.message.name}`, `Error!`,{
        timeOut: 3000,
        closeButton: true,
        progressBar: true,
      });
      console.log(err)
    })
  }



  onSubmit(){
    if(this.myForm.valid){
      console.log(this.myForm.value)
      const email = this.myForm.value;
      this._authService.sendOtp(email).subscribe((res : any)=>{
        console.log(res)
        if(res){
          this.otpShown.next(true);
          this.otpShown.complete(); 
          this.toastr.info(`${res.message}`, `Success!`,{
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          });
        }
      }, (err: any)=>{
        console.log(err.error.message.name)
        this.toastr.error(`${err.error.message.name}`, `Error!`,{
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
        });
      })
    } else{
      console.log("Form Invalid......")
    }
  }

}
