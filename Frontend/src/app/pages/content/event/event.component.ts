import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventserviceService } from 'src/app/core/services/eventservice.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IEvent } from 'src/app/core/interfaces/IEvent';
import { EventService } from 'ag-grid-community';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  eventForm: FormGroup;
  eventId!: string;
  isDarkMode: boolean = false;
  editMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', [Validators.required, this.dateGreaterThanTodayValidator]],
      location: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.editMode = !!this.eventId;
    if (this.eventId && this.editMode) {
      this.eventService.getEvent(this.eventId).subscribe((event: any) => {
        if (event && event.result) {
          const formattedEvent = {
            ...event.result,
            date: this.formatDate(event.result.date)
          };
          this.eventForm.patchValue(formattedEvent);
        }
      });
    }
  }

  dateGreaterThanTodayValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison

    if (selectedDate < today) {
      return { dateGreaterThanToday: true };
    }
    return null;
  }


  formatDate(date: string): string {
    const eventDate = new Date(date);
    const year = eventDate.getFullYear();
    const month = ('0' + (eventDate.getMonth() + 1)).slice(-2);
    const day = ('0' + eventDate.getDate()).slice(-2);
    const hours = ('0' + eventDate.getHours()).slice(-2);
    const minutes = ('0' + eventDate.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  onSubmit(): void {
    if (this.eventForm.valid) {
      const event: IEvent = this.eventForm.value;
      if (this.eventId) {
        this.eventService.updateEvent(this.eventId, event).subscribe((response: any) => {
          this.toastr.info(`${response.message}`, `Success!`, {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          });
          this.router.navigateByUrl('/pages/content/dashboard');
        });
      } else {
        this.eventService.createEvent(event).subscribe((response: any) => {
          this.toastr.info(`${response.message}`, `Success!`, {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          });
          this.router.navigateByUrl('/pages/content/dashboard');
        });
      }
    }
  }
}
