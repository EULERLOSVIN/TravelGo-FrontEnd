import { Routes } from '@angular/router';
import { MainPage } from './layouts/pages/main.page/main.page';
import { HomePage } from './features/Home/pages/home/home.page';

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
            }
        ]
    }
    
];
