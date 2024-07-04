import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiUrl : string = environment.apiUrl;
  constructor(private http: HttpClient) { }
  
  
  upload(file: File, formData: any): Observable<HttpEvent<any>> {
    const uploadData = new FormData();
    uploadData.append('file', file);
    Object.keys(formData).forEach(key => {
      uploadData.append(key, formData[key]);
    });

    return this.http.post<any>(`${this.apiUrl}/media`, uploadData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        throw error;
      })
    );
  }

  getMedia(){
    return this.http.get(`${this.apiUrl}/media`);
  }

  deleteMedia(id : string){
    return this.http.delete(`${this.apiUrl}/media/${id}`);
  }

  updateMedia(id : string, data : any){
    return this.http.put(`${this.apiUrl}/media/${id}`, data);
  }

  getMediaById(id : string){
    return this.http.get(`${this.apiUrl}/media/${id}`);
  }
}
