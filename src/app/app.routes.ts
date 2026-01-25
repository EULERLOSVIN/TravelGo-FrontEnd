import { Routes } from '@angular/router';
import { MainPage } from './layouts/pages/main.page/main.page';
import { SelectRoutePage } from './features/seleccionderuta/pages/select-route.page/select-route.page';

export const routes: Routes = [
    {
        path: '',
        component: MainPage
    },
    {
        path: 'seleccionar-ruta',
        component: SelectRoutePage
    }
    
];
