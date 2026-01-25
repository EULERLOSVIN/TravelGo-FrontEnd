import { Routes } from '@angular/router';
import { HomePage } from './features/Home/pages/home/home.page';
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
                path: 'select-route',
                component:SelectRoutePage
            }

        ]
   }
    
];
