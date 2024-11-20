import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService, BlogPost } from '../../services/blog.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  posts: BlogPost[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load blog posts. Please try again later.';
        this.loading = false;
        console.error('Error loading posts:', error);
      }
    });
  }

  viewPost(postId: number): void {
    // Removed the router import, so this method is no longer valid
    // this.router.navigate(['/post', postId]);
  }
}
