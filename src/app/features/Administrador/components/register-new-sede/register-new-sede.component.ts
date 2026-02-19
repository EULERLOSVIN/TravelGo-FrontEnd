import { Component, EventEmitter, Input, Output, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HeadquartersService } from '../../services/headquarters.service';
import { UbigeoService } from '../../../../core/services/ubigeo.service';

@Component({
    selector: 'app-register-new-sede',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register-new-sede.component.html',
    styleUrl: './register-new-sede.component.scss'
})
export class RegisterNewSedeComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<any>();

    form: FormGroup;
    isLoading = false;
    isSuccess = false;

    // Listas para los selectores
    departments: any[] = [];
    provinces: any[] = [];
    districts: any[] = [];

    constructor(
        private fb: FormBuilder,
        private service: HeadquartersService,
        private ubigeoService: UbigeoService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {
        this.form = this.fb.group({
            IdCompany: [1, [Validators.required]],
            IdStateHeadquarter: [1, [Validators.required]],
            Name: ['', [Validators.required, this.noPureNumbersValidator]],
            Address: ['', [Validators.required]],
            Department: ['', [Validators.required]],
            Province: ['', [Validators.required]],
            District: ['', [Validators.required]],
            Phone: ['', [Validators.required]],
            Email: ['', [Validators.email]],
            IsMain: [false]
        });

        // Cargar departamentos al iniciar
        this.loadDepartments();
        console.log('RegisterNewSedeComponent: Loaded with Ubigeo Selectors');
    }

    // --- Lógica de Ubigeo ---

    loadDepartments() {
        this.ubigeoService.getDepartments().subscribe(data => {
            this.departments = data;
        });
    }

    onDepartmentChange(event: any) {
        const selectedDep = event.target.value;

        // Reset province and district
        this.provinces = [];
        this.districts = [];
        this.form.patchValue({ Province: '', District: '' });

        if (selectedDep) {
            this.ubigeoService.getProvinces(selectedDep).subscribe(data => {
                this.provinces = data;
            });
        }
    }

    onProvinceChange(event: any) {
        const selectedProv = event.target.value;
        const currentDep = this.form.get('Department')?.value;

        // Reset district
        this.districts = [];
        this.form.patchValue({ District: '' });

        if (selectedProv && currentDep) {
            this.ubigeoService.getDistricts(selectedProv, currentDep).subscribe(data => {
                this.districts = data;
            });
        }
    }

    // Validador personalizado: No permitir solo números
    noPureNumbersValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null; // Si está vacío, lo maneja required
        const isNumeric = /^\d+$/.test(value);
        return isNumeric ? { isNumeric: true } : null;
    }

    onClose() {
        this.close.emit();
        this.resetForm();
    }

    resetForm() {
        this.isSuccess = false;
        this.form.reset({ IdCompany: 1, IdStateHeadquarter: 1, IsMain: false });
        this.provinces = [];
        this.districts = [];
    }

    onSubmit() {
        console.log('Intento de envío. Form válido:', this.form.valid);

        if (this.form.invalid) {
            console.warn('El formulario es inválido. Errores:');
            Object.keys(this.form.controls).forEach(key => {
                const errors = this.form.get(key)?.errors;
                if (errors) {
                    console.error(`Campo '${key}' tiene errores:`, errors);
                }
            });
            this.form.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.cdr.detectChanges(); // Ensure UI shows loading immediately

        try {
            console.log('Enviando datos al servicio:', this.form.value);
            this.service.create(this.form.value).subscribe({
                next: (res) => {
                    console.log('Respuesta exitosa del backend:', res);
                    this.isLoading = false;
                    this.isSuccess = true;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Error detallado del backend:', err);
                    this.isLoading = false;

                    let errorMessage = 'Error desconocido';
                    if (typeof err.error === 'string') {
                        errorMessage = err.error;
                    } else if (err.error?.message) {
                        errorMessage = err.error.message;
                    } else if (err.message) {
                        errorMessage = err.message;
                    }

                    alert('Error al crear la sede: ' + errorMessage + '\n\nRevisa la consola (F12) para más detalles.');
                    this.cdr.detectChanges();
                }
            });
        } catch (e) {
            console.error('Error síncrono en onSubmit:', e);
            this.isLoading = false;
            alert('Error interno en la aplicación. Revisa la consola.');
            this.cdr.detectChanges();
        }
    }

    setEstado(id: number) {
        this.form.patchValue({ IdStateHeadquarter: id });
    }

    finish() {
        this.close.emit(true);
        this.resetForm();
    }
}

