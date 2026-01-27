import { Routes } from '@angular/router';
import { HomePage } from './features/Home/pages/home/home.page';
import { SelectSeatPage } from './features/SelectSeat/pages/select-seat/select-seat.page';
import { FillDataComponent } from './features/FillData/pages/fill-data/fill-data.component';
import { MainPage } from './layouts/pages/main.page/main.page';
import { SelectRoutePage } from './features/seleccionderuta/pages/select-route.page/select-route.page';

export const routes: Routes = [
   {
        path: '',
        component: MainPage,
        children:[
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component:HomePage
            },
            {
                path:'select-seat',
                component: SelectSeatPage,
            },
            {
                path: 'fill-data',
                component: FillDataComponent
                
            },
            {
                path: 'select-route',
                component:SelectRoutePage
            }


        ]
    }
                      
   
];

