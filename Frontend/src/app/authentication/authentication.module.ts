import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { OtpComponent } from './otp/otp.component';
import { GenerateOtpComponent } from './otp/generate-otp/generate-otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
// import { NgOtpInputComponent } from 'ng-otp-input';


@NgModule({
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    SignupComponent,
    OtpComponent,
    GenerateOtpComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    ToastrModule.forRoot(),
  ]
})
export class AuthenticationModule { }
