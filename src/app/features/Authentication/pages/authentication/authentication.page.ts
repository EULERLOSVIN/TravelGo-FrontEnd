import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequestModel } from '../../models/LoginRequest.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-authentication',
  imports: [CommonModule, FormsModule],
  templateUrl: './authentication.page.html',
  styleUrl: './authentication.page.scss',
})

export class AuthenticationPage {

  loginData: LoginRequestModel = {
    email: '',
    password: ''
  };

  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.rol); 
        this.redirectByUserRole(response.rol);
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        alert('Credenciales incorrectas');
      }
    });
  }

  private redirectByUserRole(role: string): void {
    switch (role) {
      case 'Administrador':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'Secretario':
        this.router.navigate(['/ventas']);
        break;
      case 'Chofer':
        this.router.navigate(['/mis-rutas']);
        break;
      default:
        this.router.navigate(['/dashboard']); // Vista por defecto
        break;
    }
  }
}
