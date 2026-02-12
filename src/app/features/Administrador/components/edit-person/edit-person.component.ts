import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Corregido: ReactiveFormsModule
import { EditPersonnelService } from '../../services/edit-personnel.service';
import { EditPersonnelModel } from '../../models/EditPersonnel.model';
import { PersonnelModel } from '../../models/personnel.model';
import { GetRoleAndTypeDocumentService } from '../../services/get-role-and-type-document.service';
import { RolesAndDocumentTypes } from '../../models/RolesAndDocumentTypes.model';

@Component({
  selector: 'app-edit-person',
  standalone: true,
  // IMPORTANTE: Se requiere ReactiveFormsModule para usar [formGroup]
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.scss'],
})
export class EditPersonComponent implements OnInit {
  @ViewChild('editModal') modalElement!: ElementRef;
  @Output() onUpdateSuccess = new EventEmitter<void>();

  editForm!: FormGroup;
  currentUserId!: number;
  isLoading = false;

  requiredLists: RolesAndDocumentTypes = {
    roles: [],
    documentTypes: [],
    stateOfAccount: [],
  };

  constructor(
    private fb: FormBuilder,
    private editPersonnelService: EditPersonnelService,
    private roleAndTypeService: GetRoleAndTypeDocumentService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getRequiredLists();
  }

  getRequiredLists() {
    this.roleAndTypeService.getRolesAndDocumentTypes().subscribe({
      next: (data) => {
        this.requiredLists = data;
      },
    });
  }

  initForm() {
    this.editForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        idTypeDocument: [1, [Validators.required]],
        numberDocument: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
        idRole: [1, [Validators.required]],
        newPassword: [''],
        confirmPassword: [''],
        idStateOfAccount: [1],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('newPassword')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  open(data: PersonnelModel) {
    this.currentUserId = data.id;

    // 1. Mapeo de Rol (Mantenemos tu lógica que funciona)
    const foundRole = this.requiredLists.roles.find(
      (r) => r.name.trim().toLowerCase() === data.role.trim().toLowerCase(),
    );
    const roleId = foundRole ? foundRole.id : 1;

    // 2. CORRECCIÓN: Mapeo de Tipo de Documento Real
    // Buscamos en la lista oficial el ID que coincida con el nombre que viene en 'data.typeDocument'
    const foundDocType = this.requiredLists.documentTypes.find(
      (d) => d.name.trim().toLowerCase() === data.typeDocument.trim().toLowerCase()
    );

    // Si lo encuentra usa ese ID, si no, aplicamos tu lógica de respaldo por longitud de DNI
    let docTypeId: number;

    if (foundDocType) {
      docTypeId = foundDocType.id;
    } else {
      // Lógica de respaldo por si el backend no envía el nombre exacto
      if (data.dni.length === 8) {
        const dniType = this.requiredLists.documentTypes.find((d) =>
          d.name.toLowerCase().includes('dni'),
        );
        docTypeId = dniType ? dniType.id : 1;
      } else {
        const otherType = this.requiredLists.documentTypes.find(
          (d) => !d.name.toLowerCase().includes('dni'),
        );
        docTypeId = otherType ? otherType.id : 2;
      }
    }

    // 3. Mapeo de Estado
    const stateId = data.state.trim().toUpperCase() === 'ACTIVO' ? 1 : 2;

    // 4. Asignación al Formulario
    this.editForm.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      idTypeDocument: docTypeId, // <-- CLAVE: Ahora enviamos el ID numérico, no el string
      numberDocument: data.dni,
      phoneNumber: data.phoneNumber,
      idRole: roleId,
      idStateOfAccount: stateId,
    });

    const modal = new (window as any).bootstrap.Modal(this.modalElement.nativeElement);
    modal.show();
  }

  saveChanges() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.editForm.value;

    // CONSTRUCCIÓN DEL OBJETO EXACTO SEGÚN TU BACKEND
    const updateData = {
      idAccount: Number(this.currentUserId), // ID de la cuenta que estamos editando
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      idTypeDocument: Number(formValue.idTypeDocument),
      numberDocument: String(formValue.numberDocument),
      phoneNumber: String(formValue.phoneNumber),
      idRole: Number(formValue.idRole),
      // Aseguramos que el password NO sea null (si está vacío, mandamos string vacío)
      newPassword: formValue.newPassword || '',
      confirmPassword: formValue.confirmPassword || '',
      idStateOfAccount: Number(formValue.idStateOfAccount), // El nombre debe ser EXACTO
    };

    console.log('Enviando a TravelGo:', updateData);

    this.editPersonnelService.updatePersonnel(updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.onUpdateSuccess.emit();
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        // Si sigue fallando, expande este objeto en la consola:
        console.error('Errores detallados:', err.error.errors);
        alert('Error 400: Revisa los datos en la consola.');
      },
    });
  }

  getStileSwitch() {
    const state = this.editForm.get('idStateOfAccount')?.value;
    return state === 1 ? 'bg-success border-success' : 'bg-danger border-danger';
  }

  getLabelStyle() {
    const state = this.editForm.get('idStateOfAccount')?.value;
    return state === 1 ? 'text-success' : 'text-danger';
  }

  close() {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElement.nativeElement);
    if (modal) modal.hide();
    this.editForm.reset({ idTypeDocument: 1, idRole: 1, idStateOfAccount: 1 });
    this.isLoading = false;
  }
}
