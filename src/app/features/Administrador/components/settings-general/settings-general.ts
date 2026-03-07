import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsGeneralService, CompanySettings } from '../../services/settings-general.service';

@Component({
  selector: 'app-settings-general',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-general.html',
  styleUrl: './settings-general.scss',
})
export class SettingsGeneral implements OnInit {
  companySettings: CompanySettings = {
    idCompany: 0,
    businessName: '',
    ruc: '',
    fiscalAddress: '',
    phone: '',
    email: ''
  };
  isLoading = true;
  isSaving = false;
  errorMessage = '';

  showSuccessToast = false;

  constructor(
    private settingsService: SettingsGeneralService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: (response: any) => {
        // Checking if backend uses a Result wrapper (isSuccess, value) or direct DTO
        const data = response.isSuccess !== undefined ? response.value : response;

        if (data) {
          this.companySettings = data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching company settings', err);
        this.errorMessage = 'No se pudo cargar la configuración de la empresa. Por favor, verifique su conexión o vuelva a iniciar sesión.';
        this.isLoading = false;

        if (err.status === 401 || err.status === 403) {
          localStorage.clear();
          this.router.navigate(['/authentication']);
        }

        this.cdr.detectChanges();
      }
    });
  }

  saveSettings(): void {
    this.isSaving = true;
    this.settingsService.updateSettings(this.companySettings).subscribe({
      next: () => {
        this.showSuccessToast = true;
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.showSuccessToast = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Error updating company settings', err);
        alert('Error al actualizar la configuración'); // Keep this as a fallback for real fatal errors
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
