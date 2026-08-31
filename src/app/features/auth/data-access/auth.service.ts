import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  LoginCredentials,
  LoginResponse,
  RegisteredUser,
  RegisterUser,
} from '../models/auth.model';

interface LocalAccount {
  username: string;
  email: string;
  passwordHash: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly localAccountsKey = 'auth_local_accounts';
  private readonly authenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  readonly isAuthenticated$ = this.authenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(environment.baseApi + 'auth/login', credentials)
      .pipe(
        catchError((apiError) =>
          from(this.validateLocalAccount(credentials)).pipe(
            switchMap((isValid) =>
              isValid
                ? of({ token: this.createLocalToken(credentials.username) })
                : throwError(() => apiError)
            )
          )
        ),
        tap(({ token }) => this.startSession(token))
      );
  }

  register(user: RegisterUser): Observable<RegisteredUser> {
    const request = {
      id: 0,
      ...user,
      name: { firstname: '', lastname: '' },
      address: {
        city: '',
        street: '',
        number: 0,
        zipcode: '',
        geolocation: { lat: '0', long: '0' },
      },
      phone: '',
    };

    return this.http
      .post<RegisteredUser>(environment.baseApi + 'users', request)
      .pipe(
        switchMap((createdUser) =>
          from(this.saveLocalAccount(user)).pipe(map(() => createdUser))
        )
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return Boolean(localStorage.getItem(this.tokenKey));
  }

  private startSession(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.authenticatedSubject.next(true);
  }

  private async saveLocalAccount(user: RegisterUser): Promise<void> {
    const accounts = this.getLocalAccounts().filter(
      (account) => account.username.toLowerCase() !== user.username.toLowerCase()
    );

    accounts.push({
      username: user.username,
      email: user.email,
      passwordHash: await this.hashPassword(user.password),
    });

    localStorage.setItem(this.localAccountsKey, JSON.stringify(accounts));
  }

  private async validateLocalAccount(credentials: LoginCredentials): Promise<boolean> {
    const account = this.getLocalAccounts().find(
      (candidate) =>
        candidate.username.toLowerCase() === credentials.username.toLowerCase()
    );

    if (!account) {
      return false;
    }

    return account.passwordHash === (await this.hashPassword(credentials.password));
  }

  private getLocalAccounts(): LocalAccount[] {
    try {
      return JSON.parse(localStorage.getItem(this.localAccountsKey) || '[]');
    } catch {
      return [];
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', bytes);

    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  private createLocalToken(username: string): string {
    return btoa(JSON.stringify({ username, source: 'local-demo' }));
  }
}
