import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeadquartersService } from '../../services/headquarters.service';
import { Headquarter } from '../../models/headquarter.model';
import { UbigeoService } from '../../../../core/services/ubigeo.service';

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

    departments: any[] = [];
    provinces: any[] = [];
    districts: any[] = [];

    constructor(
        private fb: FormBuilder,
        private service: HeadquartersService,
        private ubigeoService: UbigeoService
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

    ngOnInit() {
        // Load departments initially
        this.loadDepartments();
        console.log('EditSedeComponent: Loaded with Ubigeo Selectors');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['sede'] && this.sede) {
            const stateId = this.sede.stateHeadquarter === 'Activo' ? 1 : 2;

            this.form.patchValue({
                IdHeadquarter: this.sede.idHeadquarter,
                IdCompany: 1,
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

            // Pre-load cascading dropdowns based on existing values
            if (this.sede.department) {
                this.loadProvinces(this.sede.department);
            }
            if (this.sede.province && this.sede.department) {
                this.loadDistricts(this.sede.province, this.sede.department);
            }
        }
    }

    // --- Ubigeo Logic ---

    loadDepartments() {
        this.ubigeoService.getDepartments().subscribe(data => this.departments = data);
    }

    loadProvinces(depName: string) {
        this.ubigeoService.getProvinces(depName).subscribe(data => this.provinces = data);
    }

    loadDistricts(provName: string, depName: string) {
        this.ubigeoService.getDistricts(provName, depName).subscribe(data => this.districts = data);
    }

    onDepartmentChange(event: any) {
        const selectedDep = event.target.value;
        this.provinces = [];
        this.districts = [];
        this.form.patchValue({ Province: '', District: '' });

        if (selectedDep) {
            this.loadProvinces(selectedDep);
        }
    }

    onProvinceChange(event: any) {
        const selectedProv = event.target.value;
        const currentDep = this.form.get('Department')?.value;

        this.districts = [];
        this.form.patchValue({ District: '' });

        if (selectedProv && currentDep) {
            this.loadDistricts(selectedProv, currentDep);
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
