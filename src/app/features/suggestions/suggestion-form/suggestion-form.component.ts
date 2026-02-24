import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SuggestionService } from '../../../core/services/suggestion.service'; // ← AJOUTER
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  
  // Liste des catégories
  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private suggestionService: SuggestionService // ← INJECTER LE SERVICE
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire avec les validateurs
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z]*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required]
    });
  }

  // Getters pour accéder facilement aux champs
  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }

  // Date du jour au format YYYY-MM-DD
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ✅ VERSION MODIFIÉE avec appel API
  onSubmit(): void {
    if (this.suggestionForm.valid) {
      
      // Préparer les données pour l'API (sans id, sans date)
      const newSuggestion = {
        title: this.suggestionForm.value.title,
        description: this.suggestionForm.value.description,
        category: this.suggestionForm.value.category,
        status: 'en_attente',
        nbLikes: 0
      };

      // Appel API pour ajouter la suggestion
      this.suggestionService.addSuggestion(newSuggestion).subscribe({
        next: (response: any) => {
          console.log('✅ Suggestion ajoutée:', response);
          this.router.navigate(['/suggestions']); // Redirection vers la liste
        },
        error: (err: any) => {
          console.error('❌ Erreur ajout:', err);
          alert('Erreur lors de l\'ajout de la suggestion');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/suggestions']);
  }
}