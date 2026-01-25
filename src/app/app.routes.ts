import { Routes } from '@angular/router';
import { MainPage } from './layouts/pages/main.page/main.page';
import { SelectSeatPage } from './features/SelectSeat/pages/select-seat/select-seat.page';

export const routes: Routes = [
    {
        path: '',
        component: MainPage
    },
    {
        path: 'select-seat',
        component:SelectSeatPage
    }
];

