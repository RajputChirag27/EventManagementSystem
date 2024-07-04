import { Component, OnInit } from '@angular/core';
import { MediaService } from 'src/app/core/services/media.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-media-form',
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.scss']
})
export class MediaFormComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  editMode: boolean = false;
  mediaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _mediaService: MediaService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: [[], Validators.required],
      file: [null]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.mediaId = params.get('id');
      this.editMode = !!this.mediaId;
      if (this.editMode) {
        this.loadMediaData();
      }
    });
  }

  loadMediaData(): void {
    if (this.mediaId) {
      this._mediaService.getMediaById(this.mediaId).subscribe((media : any) => {
        this.uploadForm.patchValue({
          title: media.result.title,
          description: media.result.description,
          tags: media.result.tags ? media.result.tags.join(', ') : ''
        });
        // File input is not updated as we don't need to upload a new file in edit mode
        // this.uploadForm.markAsPristine(); // Ensure form is marked as pristine after patching
      }, error => {
        this.toastr.error(`Failed to load media data: ${error.message}`, 'Error!', {
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
        });
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadForm.patchValue({ file: file });
    }
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      const formData = {
        title: this.uploadForm.get('title')?.value,
        description: this.uploadForm.get('description')?.value,
        tags: this.uploadForm.get('tags')?.value.split(',').map((tag: string) => tag.trim())
      };

      if (this.editMode && this.mediaId) {
        // Update media
        this._mediaService.updateMedia(this.mediaId, formData).subscribe(response => {
          this.toastr.info('Media Updated Successfully', 'Success!', {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          });
          this.router.navigateByUrl('pages/content/dashboard');
        }, error => {
          this.toastr.error(`Update Failed: ${error.message}`, 'Error!', {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          });
        });
      } else if (this.selectedFile) {
        // Upload new media
        this._mediaService.upload(this.selectedFile, formData).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.uploadProgress = Math.round((100 * event.loaded) / event.total);
            }
          } else if (event.type === HttpEventType.Response) {
            this.uploadProgress = null;
            this.toastr.info('Media Uploaded Successfully', 'Success!', {
              timeOut: 3000,
              closeButton: true,
              progressBar: true,
            });
            this.router.navigateByUrl('pages/content/dashboard');
          }
        }, error => {
          this.uploadProgress = null;
          this.toastr.error(`Upload Failed: ${error.message}`, 'Error!', {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          });
        });
      }
    }
  }
}
