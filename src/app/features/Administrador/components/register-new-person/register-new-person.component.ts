import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register-new-person',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register-new-person.component.html',
    styleUrls: ['./register-new-person.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterNewPersonComponent {

    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    // Data Model
    formData = {
        dni: '',
        fullName: '',
        phone: '',
        role: '',
        username: '',
        password: '',
        status: 'active'
    };

    // UI State
    showPassword = false;
    isValidating = false;

    closeModal() {
        this.close.emit();
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    // Simulated validation
    validateDni() {
        if (!this.formData.dni) return;
        this.isValidating = true;
        setTimeout(() => {
            this.isValidating = false;
            this.formData.fullName = 'Ana Lucía (Simulado)';
        }, 1000);
    }

    save() {
        console.log('Saving person:', this.formData);
        this.closeModal();
    }
}
