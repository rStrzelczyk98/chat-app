import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private room!: string;
  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.route.queryParams
      .pipe(
        map(({ room }) => room),
        take(1)
      )
      .subscribe(
        (param) => (this.room = param ? decodeURIComponent(param) : 'list')
      );
  }

  loginWithGoogle() {
    this.authService.loginWithProvider('google', this.room);
  }
  loginWithGithub() {
    this.authService.loginWithProvider('github', this.room);
  }
}
