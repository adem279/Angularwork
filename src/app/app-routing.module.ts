import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { NotfoundComponent } from './core/notfound/notfound.component';

const routes: Routes = [
  // Route par défaut - redirige vers /home
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Route vers la page d'accueil
  { path: 'home', component: HomeComponent },
  
  // Routes lazy loading
  { path: 'suggestions', loadChildren: () => import('./features/suggestions/suggestions.module').then(m => m.SuggestionsModule) },
  { path: 'users', loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule) },
  
  // Route 404 - doit être en dernier
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }