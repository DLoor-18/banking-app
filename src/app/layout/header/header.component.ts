import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  private tokenService = inject(TokenService);

  logout() {
    this.tokenService.revokeToken();
    this.router.navigate(['login']);
  }

}