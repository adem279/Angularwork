import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // IMPORTANT pour [(ngModel)]
import { RouterModule } from '@angular/router'; // IMPORTANT pour routerLink
import { SuggestionsRoutingModule } from './suggestions-routing.module';
import { SuggestionsComponent } from './suggestions.component';
import { SuggestionsListComponent } from './suggestions-list/suggestions-list.component'; // ✅ AJOUTÉ
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';

@NgModule({
  declarations: [
    SuggestionsComponent,
    SuggestionsListComponent, // ✅ DÉCLARÉ ICI
    SuggestionDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // ✅ AJOUTÉ pour ngModel
    RouterModule, // ✅ AJOUTÉ pour routerLink
    SuggestionsRoutingModule
  ]
})
export class SuggestionsModule { }