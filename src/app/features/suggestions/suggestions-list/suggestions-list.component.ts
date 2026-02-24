import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestions-list',
  templateUrl: './suggestions-list.component.html',
  styleUrls: ['./suggestions-list.component.css']
})
export class SuggestionsListComponent implements OnInit {

  suggestions: Suggestion[] = [];
  favorites: Suggestion[] = [];
  searchText: string = '';
  
  // Propriétés pour les messages
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;
  
  // Propriétés pour les filtres
  currentFilter: string = 'all';
  showFavoritesView: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ========================================
  // NAVIGATION
  // ========================================

  // 🔹 Naviguer vers les détails
  viewDetails(suggestion: Suggestion): void {
    this.router.navigate(['/suggestions', suggestion.id]);
  }

  // 🔹 Naviguer vers le formulaire d'ajout
  goToAddSuggestion(): void {
    this.router.navigate(['/suggestions/new']);
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  // 🔹 Charger les données
  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Utiliser l'API pour récupérer les suggestions
    this.suggestionService.getSuggestionsFromApi().subscribe({
      next: (data: any) => {
        this.suggestions = data;
        this.isLoading = false;
        console.log('✅ Suggestions chargées depuis l\'API:', data);
      },
      error: (error: any) => {
        console.error('❌ Erreur API:', error);
        this.errorMessage = 'Erreur de chargement. Utilisation des données locales.';
        
        // Fallback sur les données statiques
        this.suggestions = this.suggestionService.getSuggestionsList();
        this.isLoading = false;
      }
    });

    // Charger les favoris depuis localStorage
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          this.favorites = JSON.parse(savedFavorites).map((s: any) => ({
            ...s,
            date: new Date(s.date)
          }));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        this.errorMessage = 'Erreur lors du chargement des favoris';
      }
    }
  }

  // ✅ Méthode pour supprimer une suggestion
  deleteSuggestion(suggestion: Suggestion): void {
    if (confirm(`Voulez-vous vraiment supprimer "${suggestion.title}" ?`)) {
      this.suggestionService.deleteSuggestion(suggestion.id).subscribe({
        next: () => {
          this.showSuccess(`✅ "${suggestion.title}" supprimée`);
          this.loadData(); // Recharger la liste
        },
        error: (err) => {
          console.error('❌ Erreur suppression:', err);
          this.showError('Erreur lors de la suppression');
        }
      });
    }
  }

  // ========================================
  // FILTRES ET AFFICHAGE
  // ========================================

  // 🔹 Getter pour les suggestions filtrées (recherche)
  get filteredSuggestions(): Suggestion[] {
    if (!this.searchText) {
      return this.suggestions;
    }

    const search = this.searchText.toLowerCase().trim();

    return this.suggestions.filter(s =>
      s.title.toLowerCase().includes(search) ||
      s.category.toLowerCase().includes(search) ||
      s.description.toLowerCase().includes(search)
    );
  }

  // 🔹 Getter pour l'affichage (combine filtres, recherche et favoris)
  get displaySuggestions(): Suggestion[] {
    // Mode favoris
    if (this.showFavoritesView) {
      return this.favorites;
    }
    
    // Mode recherche + filtre
    let filtered = this.filteredSuggestions;
    
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(s => s.status === this.currentFilter);
    }
    
    return filtered;
  }

  // 🔹 Définir le filtre
  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.showFavoritesView = false;
    this.showSuccess(`Filtre: ${this.getFilterLabel(filter)}`);
  }

  // 🔹 Afficher les favoris
  showFavorites(): void {
    this.showFavoritesView = true;
    this.currentFilter = 'all';
    if (this.favorites.length > 0) {
      this.showSuccess(`${this.favorites.length} suggestion(s) dans vos favoris`);
    }
  }

  // 🔹 Réinitialiser tous les filtres
  resetFilters(): void {
    if (this.showFavoritesView) {
      this.showFavoritesView = false;
      this.currentFilter = 'all';
    } else {
      this.searchText = '';
      this.currentFilter = 'all';
    }
    this.showSuccess('Filtres réinitialisés');
  }

  // 🔹 Libellé du filtre
  private getFilterLabel(filter: string): string {
    const labels: {[key: string]: string} = {
      'all': 'Toutes les suggestions',
      'acceptee': 'Acceptées',
      'en_attente': 'En attente',
      'refusee': 'Refusées'
    };
    return labels[filter] || filter;
  }

  // ========================================
  // STATISTIQUES
  // ========================================

  // 🔹 Nombre de suggestions acceptées
  getAcceptedCount(): number {
    return this.suggestions.filter(s => s.status === 'acceptee').length;
  }

  // 🔹 Nombre de suggestions en attente
  getPendingCount(): number {
    return this.suggestions.filter(s => s.status === 'en_attente').length;
  }

  // 🔹 Nombre de suggestions refusées
  getRejectedCount(): number {
    return this.suggestions.filter(s => s.status === 'refusee').length;
  }

  // 🔹 Nombre total de likes
  getTotalLikes(): number {
    return this.suggestions.reduce((total, s) => total + s.nbLikes, 0);
  }

  // ========================================
  // GESTION DES LIKES
  // ========================================

  // 🔹 Incrémenter les likes
  incrementLikes(suggestion: Suggestion): void {
    suggestion.nbLikes++;
    // TODO: Appeler l'API pour mettre à jour le like
    this.showSuccess(`👍 Like ajouté pour "${suggestion.title}"`);
  }

  // ========================================
  // GESTION DES FAVORIS
  // ========================================

  // 🔹 Vérifier si une suggestion est en favoris
  isFavorite(suggestion: Suggestion): boolean {
    return this.favorites.some(fav => fav.id === suggestion.id);
  }

  // 🔹 Ajouter aux favoris
  addToFavorites(suggestion: Suggestion): void {
    if (!this.isFavorite(suggestion)) {
      this.favorites.push({...suggestion});
      this.saveFavorites();
      this.showSuccess(`⭐ "${suggestion.title}" ajouté aux favoris`);
    }
  }

  // 🔹 Retirer des favoris
  removeFromFavorites(suggestion: Suggestion): void {
    const index = this.favorites.findIndex(fav => fav.id === suggestion.id);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
      this.showSuccess(`❌ "${suggestion.title}" retiré des favoris`);
    }
  }

  // 🔹 Toggle favoris (ajouter/retirer)
  toggleFavorite(suggestion: Suggestion): void {
    if (this.isFavorite(suggestion)) {
      this.removeFromFavorites(suggestion);
    } else {
      this.addToFavorites(suggestion);
    }
  }

  // 🔹 Sauvegarder favoris
  private saveFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
        this.errorMessage = 'Erreur lors de la sauvegarde des favoris';
      }
    }
  }

  // 🔹 Vider tous les favoris
  clearAllFavorites(): void {
    if (this.favorites.length > 0) {
      if (confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
        this.favorites = [];
        this.saveFavorites();
        this.showSuccess('Tous les favoris ont été supprimés');
      }
    }
  }

  // ========================================
  // GESTION DE LA RECHERCHE
  // ========================================

  // 🔹 Effacer la recherche
  clearSearch(): void {
    this.searchText = '';
    this.showSuccess('Recherche effacée');
  }

  // ========================================
  // GESTION DES MESSAGES
  // ========================================

  // 🔹 Afficher message succès
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
    
    // Auto-effacer après 3 secondes
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  // 🔹 Afficher message erreur
  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
    
    // Auto-effacer après 3 secondes
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}