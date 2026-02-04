import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  hasAlerts = true; // Cambia a false si no tienes alertas 


  collapsed = false;

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }
}
