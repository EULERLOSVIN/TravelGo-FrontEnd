import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  expandedSections: { [key: string]: boolean } = {};

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }
}
