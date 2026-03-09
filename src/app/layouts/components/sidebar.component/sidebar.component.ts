import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/Authentication/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {

  hasAlerts = true;
  collapsed = false;
  public authService = inject(AuthService);
  private router = inject(Router);

  userEmail: string | null = '';
  userRole: string | null = '';

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');
    this.userRole = localStorage.getItem('userRole');
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/authentication']);
  }
}
