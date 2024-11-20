import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="create-post-container">
      <h2>Create New Post</h2>
      <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" formControlName="title">
          <div *ngIf="postForm.get('title')?.errors?.['required'] && postForm.get('title')?.touched" class="error-message">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="summary">Summary:</label>
          <textarea id="summary" formControlName="summary" rows="2"></textarea>
          <div *ngIf="postForm.get('summary')?.errors?.['required'] && postForm.get('summary')?.touched" class="error-message">
            Summary is required
          </div>
        </div>

        <div class="form-group">
          <label for="content">Content:</label>
          <textarea id="content" formControlName="content" rows="10"></textarea>
          <div *ngIf="postForm.get('content')?.errors?.['required'] && postForm.get('content')?.touched" class="error-message">
            Content is required
          </div>
        </div>

        <button type="submit" [disabled]="postForm.invalid || isSubmitting">
          {{ isSubmitting ? 'Creating...' : 'Create Post' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .create-post-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #007bff;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    button {
      width: 100%;
      padding: 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class CreatePostComponent {
  postForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      summary: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  onSubmit() {
    if (this.postForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const currentUser = this.authService.currentUserValue;
      
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      const post = {
        ...this.postForm.value,
        author_id: currentUser.id
      };

      this.blogService.createPost(post).subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error creating post:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}
