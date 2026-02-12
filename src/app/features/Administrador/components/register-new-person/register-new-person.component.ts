import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesAndDocumentTypes } from '../../models/RolesAndDocumentTypes.model';
import { RegisterPersonnelModel } from '../../models/register-personnel.model';
import { GetRoleAndTypeDocumentService } from '../../services/get-role-and-type-document.service';
import { RegisterPersonnelService } from '../../services/register-personnel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-new-person',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-new-person.component.html',
  styleUrls: ['./register-new-person.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterNewPersonComponent implements OnInit {
  requirements: RolesAndDocumentTypes = { roles: [], documentTypes: [], stateOfAccount: [] };
  registerForm!: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private getRoleAndTypeDocumentService: GetRoleAndTypeDocumentService,
    private registerService: RegisterPersonnelService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadRolesAndTypesDocuments();
  }

  private initForm() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      typeDocument: ['', [Validators.required]],
      numberIdentityDocument: ['', [Validators.required, Validators.minLength(8)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      idRole: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loadRolesAndTypesDocuments() {
    this.getRoleAndTypeDocumentService.getRolesAndDocumentTypes().subscribe({
      next: (data: any) => {
        this.requirements = data;
        this.cdr.detectChanges();
      },
      error: (error: any) => console.error('Error al cargar requisitos', error),
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const payload: RegisterPersonnelModel = this.registerForm.value;

      this.registerService.registerPersonnel(payload).subscribe({
        next: (response) => {
          const modalElement = document.getElementById('registerNewPersonModal');
          if (modalElement) {
            const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (bootstrapModal) {
              bootstrapModal.hide();
            } else {
              const closeButton = modalElement.querySelector('.btn-close') as HTMLElement;
              closeButton?.click();
            }
          }

          this.router.navigate(['/administrator/personal']).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          console.error('Error al registrar', err);
        }
      });
    }
  }
}