import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeadquartersService } from '../../services/headquarters.service';
import { Headquarter } from '../../models/headquarter.model';

@Component({
    selector: 'app-edit-sede',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-sede.component.html',
    styleUrl: './edit-sede.component.scss'
})
export class EditSedeComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() sede: Headquarter | null = null;
    @Output() close = new EventEmitter<any>();

    form: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private service: HeadquartersService
    ) {
        this.form = this.fb.group({
            IdHeadquarter: [0],
            IdCompany: [1],
            IdStateHeadquarter: [1, [Validators.required]],
            Name: ['', [Validators.required]],
            Address: ['', [Validators.required]],
            Department: ['', [Validators.required]],
            Province: ['', [Validators.required]],
            District: ['', [Validators.required]],
            Phone: ['', [Validators.required]],
            Email: [''],
            IsMain: [false]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['sede'] && this.sede) {
            // Mapear valores del objeto sede al formulario
            // Nota: El backend devuelve 'stateHeadquarter' como string ('Activo'), 
            // pero el DTO de update espera 'IdStateHeadquarter' como int.
            // Para editar, asumiremos 1=Activo si el string es 'Activo', sino 2.
            // O mejor, si el objeto sede ya trae IdStateHeadquarter (que el modelo dice NO, solo string).
            // Si el modelo solo trae el string, tenemos un problema.
            // Solución: El backend debería devolver el ID también o mapeamos el string.
            // Asumiremos: 'Activo' -> 1, otro -> 2.

            const stateId = this.sede.stateHeadquarter === 'Activo' ? 1 : 2;

            this.form.patchValue({
                IdHeadquarter: this.sede.idHeadquarter,
                IdCompany: 1, // Default
                IdStateHeadquarter: stateId,
                Name: this.sede.name,
                Address: this.sede.address,
                Department: this.sede.department,
                Province: this.sede.province,
                District: this.sede.district,
                Phone: this.sede.phone,
                Email: this.sede.email,
                IsMain: this.sede.isMain
            });
        }
    }

    onClose() {
        this.close.emit();
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (!this.sede) return;

        this.isLoading = true;
        // update(id, dto)
        this.service.update(this.sede.idHeadquarter, this.form.value).subscribe({
            next: () => {
                this.isLoading = false;
                this.close.emit(true);
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    setEstado(id: number) {
        this.form.patchValue({ IdStateHeadquarter: id });
    }
}
