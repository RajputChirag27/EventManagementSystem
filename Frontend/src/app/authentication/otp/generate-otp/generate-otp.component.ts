import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-generate-otp',
  templateUrl: './generate-otp.component.html',
  styleUrls: ['./generate-otp.component.scss']
})
export class GenerateOtpComponent {
  @Input() otpShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // isOtp: boolean = false;
  @Output() otpChange = new EventEmitter<string>();
  otp: string = '';
  otpConfig = {
    length: 6,
    inputClass: 'otp-input',
    disableAutoFocus: false,
    allowNumbersOnly: true,
  };

  handleOtpChange(otp: string): void {
    this.otp = otp;
  }

  onSubmit(): void {
    if (this.otp.length === 6) {
      console.log('OTP:', this.otp);
      this.otpChange.emit(this.otp);
    } else {
      console.error('Invalid OTP');
    }
  }
}
