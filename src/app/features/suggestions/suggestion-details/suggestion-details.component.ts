import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {
  suggestion: any = null;
  suggestions: any[] = [];
  currentIndex: number = 0;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) { }

  ngOnInit(): void {
    this.loadAllSuggestions();
  }

  loadAllSuggestions(): void {
    this.suggestionService.getSuggestionsFromApi().subscribe({
      next: (data: any) => {
        this.suggestions = data;
        const id = +this.route.snapshot.params['id'];
        this.loadSuggestion(id);
      },
      error: (error: any) => {
        console.error('Erreur chargement suggestions:', error);
        this.isLoading = false;
      }
    });
  }

  loadSuggestion(id: number): void {
    this.currentIndex = this.suggestions.findIndex(s => s.id === id);
    this.suggestion = this.suggestions[this.currentIndex];
    this.isLoading = false;
  }

  // ✅ Méthode pour aller vers le formulaire d'édition
  goToEdit(): void {
    if (this.suggestion) {
      this.router.navigate(['/suggestions/edit', this.suggestion.id]);
    }
  }

  // Méthodes de navigation
  goToPreviousSuggestion(): void {
    if (this.hasPreviousSuggestion()) {
      this.currentIndex--;
      this.suggestion = this.suggestions[this.currentIndex];
      this.router.navigate(['/suggestions', this.suggestion.id]);
    }
  }

  goToNextSuggestion(): void {
    if (this.hasNextSuggestion()) {
      this.currentIndex++;
      this.suggestion = this.suggestions[this.currentIndex];
      this.router.navigate(['/suggestions', this.suggestion.id]);
    }
  }

  hasPreviousSuggestion(): boolean {
    return this.currentIndex > 0;
  }

  hasNextSuggestion(): boolean {
    return this.currentIndex < this.suggestions.length - 1;
  }

  goBack(): void {
    this.router.navigate(['/suggestions']);
  }
}