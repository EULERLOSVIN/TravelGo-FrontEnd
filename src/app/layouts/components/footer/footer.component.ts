import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  expandedSections: { [key: string]: boolean } = {};

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }
}
