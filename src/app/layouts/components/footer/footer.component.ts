import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from "@angular/router";

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  expandedSections: { [key: string]: boolean } = {};

  constructor(private router: Router) {}

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  handleAdminAccess(event: Event): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token && role) {
      event.preventDefault();
      this.redirectByUserRole(role);
    }
  }

  private redirectByUserRole(role: string): void {
    switch (role) {
      case 'Administrador':
        this.router.navigate(['/administrator']);
        break;
      case 'Chofer':
        this.router.navigate(['/conductor']);
        break;
      case 'Secretario':
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }
}