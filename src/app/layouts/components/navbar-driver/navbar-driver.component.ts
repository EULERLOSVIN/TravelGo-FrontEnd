import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../features/Authentication/services/auth.service';

@Component({
  selector: 'app-navbar-driver',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-driver.component.html',
  styleUrl: './navbar-driver.component.scss',
})
export class NavbarDriverComponent {
  constructor(
    private authService: AuthService,
    private router:Router
  ){}

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/authentication']);
  }
}
