import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // ← AJOUTER ActivatedRoute
import { SuggestionService } from '../../../core/services/suggestion.service';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  isEditMode: boolean = false;  // ← AJOUTER
  suggestionId: number | null = null;  // ← AJOUTER
  
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
    private route: ActivatedRoute,  // ← AJOUTER
    private router: Router,
    private suggestionService: SuggestionService
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

    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.suggestionId = +params['id'];
        this.loadSuggestionForEdit(this.suggestionId);
      }
    });
  }

  // Charger la suggestion pour édition
  loadSuggestionForEdit(id: number): void {
    this.suggestionService.getSuggestionById(id).subscribe({
      next: (data: any) => {
        this.suggestionForm.patchValue({
          title: data.title,
          description: data.description,
          category: data.category
        });
      },
      error: (err) => {
        console.error('Erreur chargement suggestion:', err);
      }
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
      
      const suggestionData = {
        title: this.suggestionForm.value.title,
        description: this.suggestionForm.value.description,
        category: this.suggestionForm.value.category,
        status: 'en_attente',
        nbLikes: 0
      };

      if (this.isEditMode && this.suggestionId) {
        // ✅ MODE MODIFICATION
        console.log('Mode édition - ID:', this.suggestionId);
        this.suggestionService.updateSuggestion(this.suggestionId, suggestionData).subscribe({
          next: (response: any) => {
            console.log('✅ Suggestion modifiée:', response);
            this.router.navigate(['/suggestions']);
          },
          error: (err: any) => {
            console.error('❌ Erreur modification:', err);
            alert('Erreur lors de la modification');
          }
        });
      } else {
        // ✅ MODE AJOUT
        console.log('Mode ajout');
        this.suggestionService.addSuggestion(suggestionData).subscribe({
          next: (response: any) => {
            console.log('✅ Suggestion ajoutée:', response);
            this.router.navigate(['/suggestions']);
          },
          error: (err: any) => {
            console.error('❌ Erreur ajout:', err);
            alert('Erreur lors de l\'ajout');
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/suggestions']);
  }
}