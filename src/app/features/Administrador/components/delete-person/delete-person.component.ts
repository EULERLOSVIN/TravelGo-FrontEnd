import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnelModel } from '../../models/personnel.model';
import { DeleteUserService } from '../../services/delete-user.service';

@Component({
  selector: 'app-delete-person',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-person.component.html',
  styleUrls: ['./delete-person.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeletePersonComponent {
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @Output() onDeleteSuccess = new EventEmitter<void>();

  personnelToDelete: PersonnelModel | null = null;
  isLoading = false; // Controla el estado del botón

  constructor(private deleteUserService: DeleteUserService) {}

  openDeleteModal(personnel: PersonnelModel) {
    const modalElement = new (window as any).bootstrap.Modal(this.deleteModal.nativeElement);
    this.personnelToDelete = personnel;
    modalElement.show();
  }

  closeDeleteModal() {
    const modalElement = (window as any).bootstrap.Modal.getInstance(
      this.deleteModal.nativeElement,
    );
    modalElement.hide();
  }

  confirmDelete() {
    if (!this.personnelToDelete) return;

    this.isLoading = true;
    const id = Number(this.personnelToDelete.id);

    this.deleteUserService.deleteUser(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.onDeleteSuccess.emit();
        this.closeDeleteModal();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al eliminar:', err);
      },
    });
  }
}
