import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsGeneral } from '../../components/settings-general/settings-general';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, SettingsGeneral],
  templateUrl: './admin-settings.page.html',
  styleUrl: './admin-settings.page.scss',
})
export class AdminSettingsComponent {

}
