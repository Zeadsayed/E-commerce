import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../data-access/auth.service';
import { RegisterUser } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: RegisterUser = {
    username: '',
    email: '',
    password: '',
  };

  confirmPassword = '';
  errorMessage = '';
  loading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get passwordsMatch(): boolean {
    return this.user.password === this.confirmPassword;
  }

  register(): void {
    if (!this.passwordsMatch || this.loading) {
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.register(this.user).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], {
          queryParams: {
            registered: true,
            username: this.user.username,
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = error.status === 400
          ? 'Please check your account information and try again.'
          : 'Registration is unavailable right now. Please try again.';
      },
    });
  }
}
