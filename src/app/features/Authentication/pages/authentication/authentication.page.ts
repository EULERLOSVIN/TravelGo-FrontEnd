import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequestModel } from '../../models/LoginRequest.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../models/login-response.model';
import { Result } from '../../../../shared/models/result.model';

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
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token && role) {
      this.redirectByUserRole(role);
    }
  }

  onLogin(): void {
    this.errorMessage = '';
    this.authService.login(this.loginData).subscribe({
      next: (response: Result<LoginResponse>) => {

        if (response.isSuccess) {
          const { token, rol } = response.value;
          localStorage.setItem('token', token);
          localStorage.setItem('userRole', rol);

          this.redirectByUserRole(rol);
        } else {
          this.errorMessage = response.errorMessage;
        }
      },
      error: (err) => {
        console.log('Error del servidor:', err.error);

        this.errorMessage = err.error?.errorMessage || 'Correo o contraseña incorrectos';
        this.cdr.detectChanges();
      }
    });
  }

  private redirectByUserRole(role: string): void {
    switch (role) {
      case 'Administrador':
        this.router.navigate(['/administrator']);
        break;
      case 'Chofer':
        this.router.navigate(['/driver']);
        break;
      case 'Secretario':
        this.router.navigate(['/administrator']);
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }
}