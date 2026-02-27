import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GetPlaceService } from '../../services/get-place.service';
import { PlaceModel } from '../../models/place.model';
import { Result } from '../../../../shared/models/result.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  listPlaces = signal<PlaceModel[]>([]);
  originId = signal<number | null>(null);
  dayOption = signal<number>(0);
  destinationId = signal<number | null>(null);

  constructor(private getPlaceService: GetPlaceService) {}

  ngOnInit(): void {
    this.getPlacesOfRoutes();
  }

  getPlacesOfRoutes(): void {
    this.getPlaceService.getPlaces().subscribe({
      next: (response: Result<PlaceModel[]>) => {
        if (response.isSuccess && response.value) {
          this.listPlaces.set(response.value);
          console.log('Lugares cargados:', this.listPlaces());
        }
      },
      error: (err) => {
        console.error('Error al conectar con el servidor de AWS:', err);
      }
    });
  }
}