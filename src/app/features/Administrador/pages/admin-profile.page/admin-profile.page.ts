import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminProfileService, AdminProfileModel } from '../../services/admin-profile.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.page.html',
  styleUrl: './admin-profile.page.scss',
})
export class AdminProfilePage implements OnInit {
  adminProfile: AdminProfileModel | null = null;
  isLoading = true;
  isSaving = false;
  errorMessage = '';

  confirmPassword = '';

  showSuccessToast = false;

  updateEmail() {
    if (this.adminProfile) {
      const first = (this.adminProfile.firstName || '').trim().toLowerCase().replace(/\s+/g, '');
      const last = (this.adminProfile.lastName || '').trim().toLowerCase().split(' ')[0] || '';

      if (first || last) {
        // Only update visually if they are actually typing something.
        // We assume the domain is @travelgo.com based on the standard.
        this.adminProfile.email = `${first}.${last}@travelgo.com`.replace('..', '.');
      }
    }
  }

  constructor(
    private profileService: AdminProfileService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      const idAccount = parseInt(idAccountStr, 10);
      this.profileService.getProfile(idAccount).subscribe({
        next: (response: any) => {
          const data = response.isSuccess !== undefined ? response.value : response;
          this.adminProfile = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching admin profile data:', err);
          this.errorMessage = 'No se pudo cargar el perfil. Por favor, vuelva a iniciar sesión.';
          this.isLoading = false;

          if (err.status === 401 || err.status === 403) {
            localStorage.clear();
            this.router.navigate(['/authentication']);
          }

          this.cdr.detectChanges();
        }
      });
    } else {
      this.errorMessage = 'Sesión expirada o no iniciada.';
      this.isLoading = false;
    }
  }

  saveChanges() {
    if (!this.adminProfile) return;

    if (this.adminProfile.newPassword && this.adminProfile.newPassword !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.isSaving = true;
    const idAccountStr = localStorage.getItem('idAccount');
    const idAccount = parseInt(idAccountStr!, 10);

    this.profileService.updateProfile(idAccount, this.adminProfile).subscribe({
      next: () => {
        this.showSuccessToast = true;
        this.adminProfile!.newPassword = '';
        this.confirmPassword = '';
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.showSuccessToast = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Error updating admin profile:', err);
        alert('Error al actualizar el perfil.');
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
