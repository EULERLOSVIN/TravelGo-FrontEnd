import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequestModel } from '../../models/LoginRequest.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authentication.page.html',
  styleUrl: './authentication.page.scss',
})
export class AuthenticationPage implements OnInit {

  loginData: LoginRequestModel = {
    email: '',
    password: ''
  };

  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token && role) {
      this.redirectByUserRole(role);
    }
  }

  onLogin(): void {
    this.loading = true;
    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);

        const roleName = response.rol;

        if (roleName) {
          localStorage.setItem('userRole', roleName);
          this.redirectByUserRole(roleName);
        } else {
          console.error('El campo rol no viene en la respuesta:', response);
          alert('Error: No se pudo identificar el rol del usuario.');
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error de autenticación:', err);
        alert('Credenciales incorrectas');
      },
      complete: () => this.loading = false
    });
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