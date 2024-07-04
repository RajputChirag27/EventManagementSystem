import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable, Subject } from 'rxjs';
import { Media } from '../interfaces/IMedia';
import { Article } from '../interfaces/IArticle';
import { Page } from '../interfaces/IPage';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private articlesUpdated = new Subject<void>();

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles`);
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${id}`);
  }

  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/articles`, article);
  }

  updateArticle(id: string, article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/articles/${id}`, article).pipe(
      finalize(()=>{
        this.articlesUpdated.next();
        })
    );
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/articles/${id}`).pipe(
      finalize(()=>{
        this.articlesUpdated.next();
        })
    );
  }
// hello
  // Pages
  getPages(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.apiUrl}/pages`);
  }

  getPage(id: string): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/pages/${id}`);
  }

  createPage(page: Page): Observable<Page> {
    return this.http.post<Page>(`${this.apiUrl}/pages`, page);
  }

  updatePage(id: string, page: Page): Observable<Page> {
    return this.http.put<Page>(`${this.apiUrl}/pages/${id}`, page);
  }

  deletePage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pages/${id}`);
  }

  // Media
  getMedia(): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/media`);
  }

  uploadMedia(media: FormData): Observable<Media> {
    return this.http.post<Media>(`${this.apiUrl}/media`, media);
  }

  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/media/${id}`);
  }

}
