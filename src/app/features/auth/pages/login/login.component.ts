import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../data-access/auth.service';
import { LoginCredentials } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials: LoginCredentials = {
    username: '',
    password: '',
  };

  errorMessage = '';
  loading = false;
  showPassword = false;
  readonly showCheckoutNotice: boolean;
  readonly registrationSuccessful: boolean;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.showCheckoutNotice =
      this.route.snapshot.queryParamMap.get('returnUrl') === '/cart';
    this.registrationSuccessful =
      this.route.snapshot.queryParamMap.get('registered') === 'true';
    this.credentials.username =
      this.route.snapshot.queryParamMap.get('username') || '';
  }

  login(): void {
    if (
      !this.credentials.username ||
      !this.credentials.password ||
      this.loading
    ) {
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') || '/products';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          error.status === 400 || error.status === 401
            ? 'The username or password is incorrect.'
            : 'Login is unavailable right now. Please try again.';
      },
    });
  }
}
