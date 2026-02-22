import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire avec les validateurs
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z]*$') // Commence par majuscule, que des lettres
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

  onSubmit(): void {
    if (this.suggestionForm.valid) {
      // Récupérer les suggestions existantes
      const savedSuggestions = localStorage.getItem('suggestions');
      let suggestions: Suggestion[] = savedSuggestions ? JSON.parse(savedSuggestions) : [];
      
      // Calculer le nouvel ID
      const newId = suggestions.length > 0 
        ? Math.max(...suggestions.map(s => s.id)) + 1 
        : 1;

      // Créer la nouvelle suggestion
      const newSuggestion: Suggestion = {
        id: newId,
        title: this.suggestionForm.value.title,
        description: this.suggestionForm.value.description,
        category: this.suggestionForm.value.category,
        date: new Date(this.getCurrentDate()),
        status: 'en_attente',
        nbLikes: 0
      };

      // Ajouter à la liste
      suggestions.push(newSuggestion);

      // Sauvegarder
      localStorage.setItem('suggestions', JSON.stringify(suggestions));

      // Rediriger vers la liste
      this.router.navigate(['/suggestions']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/suggestions']);
  }
}