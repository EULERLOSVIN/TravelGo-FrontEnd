import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})

export class HomePage {

  listPlaces = [
    { id: 1, name: 'Lima' },
    { id: 2, name: 'Arequipa' },
    { id: 3, name: 'Trujillo' },
    { id: 4, name: 'Cusco' },
    { id: 5, name: 'Iquitos' },
    { id: 6, name: 'Puno' },
    { id: 7, name: 'Chiclayo' }
  ];


  origen: string = '';
  destino: string = '';
  fecha: string = '';

  constructor(private router: Router) {}

  buscar(): void {
    if (!this.origen || !this.destino || !this.fecha) {
      alert('Selecciona origen, destino y fecha');
      return;
    }

    this.router.navigate(['/select-route'], {
      queryParams: {
        origen: this.origen,
        destino: this.destino,
        fecha: this.fecha
      }
    });
  }
}
