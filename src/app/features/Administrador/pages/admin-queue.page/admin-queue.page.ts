import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterQueueComponent } from '../../components/register-queue/register-queue.component';
import { QueueManagementService } from '../../services/queue-management.service';

@Component({
    selector: 'app-admin-queue',
    standalone: true,
    imports: [CommonModule, FormsModule, RegisterQueueComponent],
    templateUrl: './admin-queue.page.html',
    styleUrl: './admin-queue.page.scss'
})
export class AdminQueueComponent implements OnInit {
    isRegisterModalOpen = false;

    // Data
    queueList: any[] = [];
    filteredQueue: any[] = [];
    searchTerm: string = '';

    // Dashboard stats
    totalUnits = 0;
    waiting = 0;
    inTransit = 0;

    constructor(
        private queueService: QueueManagementService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.refreshData();
    }

    refreshData(): void {
        this.queueService.getActiveQueue().subscribe({
            next: (data) => {
                this.queueList = data;
                this.applyFilter();
                this.calculateStats();
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching queue:', err)
        });
    }

    applyFilter(): void {
        if (!this.searchTerm) {
            this.filteredQueue = this.queueList;
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredQueue = this.queueList.filter(item =>
                item.plateNumber.toLowerCase().includes(term) ||
                item.driverName.toLowerCase().includes(term) ||
                item.routeName.toLowerCase().includes(term)
            );
        }
    }

    calculateStats(): void {
        this.totalUnits = this.queueList.length;
        this.waiting = this.queueList.length; // Simplified logic, could be filtered by status if added
        this.inTransit = 0; // Placeholder until transit logic is implemented
    }

    openRegisterModal(): void {
        this.isRegisterModalOpen = true;
    }

    closeRegisterModal(): void {
        this.isRegisterModalOpen = false;
        this.refreshData();
    }

    confirmRemove(id: number): void {
        if (confirm('¿Está seguro de retirar esta unidad de la cola?')) {
            this.queueService.removeFromQueue(id).subscribe({
                next: (success) => {
                    if (success) {
                        this.refreshData();
                    }
                },
                error: (err) => alert('Error al retirar unidad: ' + err.message)
            });
        }
    }
}
