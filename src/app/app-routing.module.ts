import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { NotfoundComponent } from './core/notfound/notfound.component';
import { ListSuggestionComponent } from './core/list-suggestion/list-suggestion.component';

const routes: Routes = [
  // Route par défaut - redirige vers /home
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Route vers la page d'accueil
  { path: 'home', component: HomeComponent },
  
  // Route vers la liste des suggestions
  { path: 'listSuggestion', component: ListSuggestionComponent },
  
  // Route 404 - doit être en dernier
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }