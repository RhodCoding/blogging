import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <a routerLink="/" class="navbar-brand">{{ title }}</a>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <ng-container *ngIf="authService.currentUser | async; else unauthLinks">
            <a routerLink="/create" routerLinkActive="active">Create Post</a>
            <a href="javascript:void(0)" (click)="logout()">Logout</a>
          </ng-container>
          <ng-template #unauthLinks>
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" routerLinkActive="active">Register</a>
          </ng-template>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
      margin-bottom: 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
    }

    .nav-links a {
      color: #666;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .nav-links a:hover {
      color: #333;
    }

    .nav-links a.active {
      color: #007bff;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 0.5rem 0;
      }

      .navbar-brand {
        font-size: 1.2rem;
      }

      .nav-links {
        gap: 1rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Blog Platform';

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
