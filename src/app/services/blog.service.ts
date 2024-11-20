import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: {
    id: number;
    username: string;
  };
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred. Please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts.php`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  getPost(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/posts.php?id=${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  createPost(post: { title: string; content: string; summary: string; author_id: number }): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/posts.php`, post, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }
}
