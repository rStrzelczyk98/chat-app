import { Inject, Injectable, inject } from '@angular/core';
import {
  GoogleAuthProvider,
  Auth,
  signInWithPopup,
  signOut,
  signInWithRedirect,
  getRedirectResult,
  GithubAuthProvider,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ChatService } from './chat.service';

export interface User {
  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
}

export type Provider = {
  [key: string]: GoogleAuthProvider | GithubAuthProvider;
};

export function chatGuard() {
  if (inject(AuthService).getUser()) return true;
  else {
    inject(Router).navigate(['']);
    return false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private providers: Provider = {
    google: new GoogleAuthProvider(),
    github: new GithubAuthProvider(),
  };
  private user!: User;
  constructor(
    private auth: Auth,
    private router: Router,
    private chatService: ChatService
  ) {}

  loginWithProvider(provider: string, redirectTo: string) {
    signInWithPopup(this.auth, this.providers[provider])
      .then((result) => {
        const user = result.user;
        this.user = {
          uid: user.uid,
          email: user.email ?? '',
          photoURL: user.photoURL ?? '',
          displayName: user.displayName ?? '',
        };
        if (redirectTo === 'list') {
          this.router.navigate([redirectTo]);
        } else {
          this.chatService.setChatName(redirectTo);
          this.router.navigate([`chat/${redirectTo}`]);
        }
      })
      .catch((error) => console.error(error.message));
  }

  logout() {
    signOut(this.auth)
      .then(() => this.router.navigate(['']))
      .catch((error) => console.error(error.message));
  }

  getUser() {
    return this.user;
  }

  test(provider: string) {
    signInWithRedirect(this.auth, this.providers[provider]);
    getRedirectResult(this.auth)
      .then((result) => {
        const user = result!.user;
        this.user = {
          uid: user.uid,
          email: user.email ?? '',
          photoURL: user.photoURL ?? '',
          displayName: user.displayName ?? '',
        };
        this.router.navigate(['list']);
      })
      .catch((error) => console.error(error.message));
  }
}
