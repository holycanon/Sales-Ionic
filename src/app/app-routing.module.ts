import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home-page',
    loadChildren: () => import('./home-page/home-page.module').then( m => m.HomePagePageModule)
  },
  {
    path: 'sales-order',
    loadChildren: () => import('./sales-order/sales-order.module').then( m => m.SalesOrderPageModule)
  },  {
    path: 'form-page',
    loadChildren: () => import('./form-page/form-page.module').then( m => m.FormPagePageModule)
  },
  {
    path: 'add-form',
    loadChildren: () => import('./add-form/add-form.module').then( m => m.AddFormPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
