import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" formControlName="username">
          <div *ngIf="registerForm.get('username')?.errors?.['required'] && registerForm.get('username')?.touched">
            Username is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" formControlName="email">
          <div *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched">
            Email is required
          </div>
          <div *ngIf="registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched">
            Please enter a valid email
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" formControlName="password">
          <div *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched">
            Password is required
          </div>
          <div *ngIf="registerForm.get('password')?.errors?.['minlength'] && registerForm.get('password')?.touched">
            Password must be at least 6 characters
          </div>
        </div>
        
        <button type="submit" [disabled]="registerForm.invalid">Register</button>
      </form>
      <p>Already have an account? <a routerLink="/login">Login</a></p>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #ccc;
    }
    button:hover:not(:disabled) {
      background-color: #0056b3;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .error-message {
      color: red;
      margin-top: 1rem;
      text-align: center;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.errorMessage = '';
    console.log('Form submitted', this.registerForm.value);
    console.log('Form valid:', this.registerForm.valid);
    
    if (this.registerForm.valid) {
      console.log('Sending registration request...');
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      console.log('Form validation errors:', this.registerForm.errors);
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}
