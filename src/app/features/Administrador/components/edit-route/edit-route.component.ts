// rutas=darwin
import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutesService, DepartureTime } from '../../services/routes.service';
import { PlacesService } from '../../services/places.service';
import { TravelRouteModel } from '../../models/TravelRoute.model';

@Component({
    selector: 'app-edit-route',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-route.component.html',
    styleUrls: ['./edit-route.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditRouteComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() routeToEdit: TravelRouteModel | null = null;
    @Output() close = new EventEmitter<void>();

    places: any[] = [];
    isLoading = false;

    // Horarios
    departureTimes: DepartureTime[] = [];
    newTime: string = '';
    deletedTimeIds: number[] = [];

    constructor(private routesService: RoutesService, private placesService: PlacesService, private cdr: ChangeDetectorRef) {
        this.loadPlaces();
    }

    loadPlaces() {
        this.placesService.getAll().subscribe(data => {
            this.places = data;
            this.cdr.detectChanges();
        });
    }

    originalRoute: TravelRouteModel | null = null;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen'] && this.isOpen && this.routeToEdit?.idTravelRoute) {
            this.loadCurrentDepartureTimes(this.routeToEdit.idTravelRoute);
        }
        if (changes['routeToEdit'] && this.routeToEdit) {
            this.originalRoute = JSON.parse(JSON.stringify(this.routeToEdit));
            this.deletedTimeIds = [];
            setTimeout(() => {
                this.cdr.detectChanges();
            }, 0);
        }
    }

    loadCurrentDepartureTimes(idRoute: number) {
        this.routesService.getDepartureTimesByRoute(idRoute).subscribe({
            next: (data) => {
                // Mapear de "HH:mm:ss" a "HH:mm" para el input
                this.departureTimes = data.map(t => ({
                    ...t,
                    hour: t.hour.substring(0, 5)
                }));
                this.cdr.detectChanges();
            },
            error: (e) => console.error('Error cargando horarios', e)
        });
    }

    addTime() {
        if (this.newTime && !this.departureTimes.some(t => t.hour === this.newTime)) {
            this.departureTimes.push({
                idDepartureTime: 0,
                idTravelRoute: this.routeToEdit?.idTravelRoute || 0,
                hour: this.newTime
            });
            this.departureTimes.sort((a, b) => a.hour.localeCompare(b.hour));
            this.newTime = '';
        }
    }

    removeTime(index: number) {
        const time = this.departureTimes[index];
        if (time.idDepartureTime > 0) {
            this.deletedTimeIds.push(time.idDepartureTime);
        }
        this.departureTimes.splice(index, 1);
    }

    hasChanges(): boolean {
        if (!this.routeToEdit || !this.originalRoute) return false;
        const routeChanged = this.routeToEdit.idPlaceA != this.originalRoute.idPlaceA ||
            this.routeToEdit.idPlaceB != this.originalRoute.idPlaceB ||
            this.routeToEdit.price != this.originalRoute.price ||
            this.routeToEdit.isActive != this.originalRoute.isActive;

        const timesChanged = this.deletedTimeIds.length > 0 || this.departureTimes.some(t => t.idDepartureTime === 0);
        return routeChanged || timesChanged;
    }

    async save() {
        if (!this.routeToEdit || this.isLoading) return;
        this.isLoading = true;

        try {
            // 1. Actualizar Datos Básicos
            await this.routesService.update(this.routeToEdit).toPromise();

            // 2. Eliminar Horarios Quitados
            if (this.deletedTimeIds.length > 0) {
                const deletePromises = this.deletedTimeIds.map(id =>
                    this.routesService.deleteDepartureTime(id).toPromise()
                        .catch(e => console.error(`No se pudo eliminar horario ${id} (quizás está en uso)`, e))
                );
                await Promise.all(deletePromises);
            }

            // 3. Agregar Nuevos Horarios
            const newTimes = this.departureTimes.filter(t => t.idDepartureTime === 0);
            if (newTimes.length > 0) {
                const addPromises = newTimes.map(t =>
                    this.routesService.addDepartureTime({
                        idTravelRoute: this.routeToEdit!.idTravelRoute!,
                        hour: t.hour + ':00'
                    }).toPromise()
                );
                await Promise.all(addPromises);
            }

            this.close.emit();
            window.location.reload();
        } catch (e: any) {
            console.error('Error al editar', e);
            alert('Error al editar: ' + (e.error?.message || e.message));
            this.isLoading = false;
        }
    }
}
