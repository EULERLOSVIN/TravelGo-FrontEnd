import { Routes } from '@angular/router';
import { HomePage } from './features/Home/pages/home/home.page';
import { SelectSeatPage } from './features/SelectSeat/pages/select-seat/select-seat.page';
import { FillDataComponent } from './features/FillData/pages/fill-data/fill-data.component';
import { MainPage } from './layouts/pages/main/main.page';
import { SelectRoutePage } from './features/seleccionderuta/pages/select-route.page/select-route.page';
import { AdminComponent } from './layouts/pages/admin/admin.page';
import { AdminSummaryComponent } from './features/Administrador/pages/admin-summary.page/admin-summary.page';
import { AdminRoutesComponent } from './features/Administrador/pages/admin-routes.page/admin-routes.page';
import { AdminVehiclesComponent } from './features/Administrador/pages/admin-vehicles.page/admin-vehicles.page';
import { AdminPersonComponent } from './features/Administrador/pages/admin-person/admin-person.page';
import { AdminSalesComponent } from './features/Administrador/pages/admin-sales.page/admin-sales.page';
import { AdminSettingsComponent } from './features/Administrador/pages/admin-settings.page/admin-settings.page';
import { AdminAlertsComponent } from './features/Administrador/pages/admin-alerts.page/admin-alerts.page';
import { AdminSedeComponent } from './features/Administrador/pages/admin-sede.page/admin-sede.page';
import { Conductor } from './features/pageConductor/features/pageConductor/conductor';
import { AuthenticationPage } from './features/Authentication/pages/authentication/authentication.page';
import { authGuard } from './core/guards/auth.guard';
import { AdministratorComponent } from './features/Administrador/pages/administrator.page/administrator.page';
import { AdminPlacesPage } from './features/Administrador/pages/admin-places.page/admin-places.page';


export const routes: Routes = [
    {
        path: '',
        component: MainPage,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: HomePage
            },
            {
                path: 'select-seat',
                component: SelectSeatPage,
            },
            {
                path: 'fill-data',
                component: FillDataComponent

            },
            {
                path: 'select-route',
                component: SelectRoutePage
            },
            {
                path: 'conductor',
                component: Conductor
            },

        ]
    },
    {
        path: 'administrator',
        component: AdminComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'summary',
                pathMatch: 'full'
            },
            { 
                path: 'summary',
                component: AdminSummaryComponent
            },
            {
                path: 'routes',
                component: AdminRoutesComponent
            },
            {
                path: 'vehicles',
                component: AdminVehiclesComponent
            },
            {
                path: 'people',
                component: AdminPersonComponent
            },
            {
                path: 'sales',
                component: AdminSalesComponent
            },
            {
                path: 'settings',
                component: AdminSettingsComponent
            },
            {
                path: 'alerts',
                component: AdminAlertsComponent
            },
            {
                path: 'sede',
                component: AdminSedeComponent
            },
            {
                path: 'personal',
                component: AdminPersonComponent
            },
            {
                path: 'app-administrator',
                component: AdministratorComponent
            },
            {
                path:'places',
                component:AdminPlacesPage
            }

        ]
    },
    {
        path: 'authentication',
        component: AuthenticationPage
    }
];

