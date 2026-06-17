import { Routes } from '@angular/router';
import { AssetListComponent } from './components/asset-list/asset-list';
import { AuthPortalComponent } from './components/auth-portal/auth-portal';

export const routes: Routes = [

  // default route → login or dashboard redirect logic inside component
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // dashboard page
  {
    path: 'dashboard',
    component: AssetListComponent
  },

  // login page (optional standalone page if you want separation)
  {
    path: 'login',
    component: AuthPortalComponent
  },

  // fallback
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];