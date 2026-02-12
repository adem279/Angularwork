import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Suggestion } from '../../models/suggestion';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  // 🔹 Charger les données
  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedSuggestions = localStorage.getItem('suggestions');
        const savedFavorites = localStorage.getItem('favorites');

        if (savedSuggestions) {
          this.suggestions = JSON.parse(savedSuggestions).map((s: any) => ({
            ...s,
            date: new Date(s.date)
          }));
        } else {
          this.initializeSuggestions();
        }

        if (savedFavorites) {
          this.favorites = JSON.parse(savedFavorites);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        this.errorMessage = 'Erreur lors du chargement des données';
        this.initializeSuggestions();
      }
    } else {
      this.initializeSuggestions();
    }

    this.isLoading = false;
  }

  // 🔹 Initialisation des données
  initializeSuggestions(): void {
    this.suggestions = [
      {
        id: 1,
        title: 'Organiser une journée team building',
        description: 'Suggestion pour organiser une journée de team building avec des activités ludiques et collaboratives.',
        category: 'Événements',
        date: new Date('2025-01-20'),
        status: 'acceptee',
        nbLikes: 10
      },
      {
        id: 2,
        title: 'Améliorer le système de réservation',
        description: 'Améliorer la gestion des réservations pour une meilleure expérience utilisateur.',
        category: 'Technologie',
        date: new Date('2025-01-15'),
        status: 'refusee',
        nbLikes: 0
      },
      {
        id: 3,
        title: 'Créer un système de récompenses',
        description: 'Motiver les employés avec un système de points et récompenses.',
        category: 'Ressources Humaines',
        date: new Date('2025-01-25'),
        status: 'refusee',
        nbLikes: 0
      },
      {
        id: 4,
        title: 'Moderniser l\'interface utilisateur',
        description: 'Refonte complète de l\'interface utilisateur pour une meilleure ergonomie.',
        category: 'Technologie',
        date: new Date('2025-01-30'),
        status: 'en_attente',
        nbLikes: 0
      },
      {
        id: 5,
        title: 'Mise en place du télétravail',
        description: 'Organisation et politique de télétravail pour plus de flexibilité.',
        category: 'Ressources Humaines',
        date: new Date('2025-02-01'),
        status: 'en_attente',
        nbLikes: 5
      },
      {
        id: 6,
        title: 'Machine à café connectée',
        description: 'Installer une machine à café intelligente avec application mobile.',
        category: 'Bien-être',
        date: new Date('2025-02-05'),
        status: 'acceptee',
        nbLikes: 15
      }
    ];

    this.saveSuggestions();
  }

  // 🔹 Sauvegarder suggestions
  saveSuggestions(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('suggestions', JSON.stringify(this.suggestions));
      } catch (error) {
        console.error('Error saving suggestions:', error);
        this.errorMessage = 'Erreur lors de la sauvegarde des suggestions';
      }
    }
  }

  // 🔹 Sauvegarder favoris
  saveFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
        this.errorMessage = 'Erreur lors de la sauvegarde des favoris';
      }
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

  // 🔹 Gestion du bouton d'action vide
  handleEmptyAction(): void {
    this.resetFilters();
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
    this.saveSuggestions();
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
  // GESTION DES SUGGESTIONS
  // ========================================

  // 🔹 Réinitialiser toutes les données
  resetAllData(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      localStorage.removeItem('suggestions');
      localStorage.removeItem('favorites');
      this.favorites = [];
      this.initializeSuggestions();
      this.currentFilter = 'all';
      this.showFavoritesView = false;
      this.searchText = '';
      this.showSuccess('Données réinitialisées avec succès');
    }
  }

  // 🔹 Ajouter une nouvelle suggestion
  addSuggestion(suggestion: Suggestion): void {
    const newId = Math.max(...this.suggestions.map(s => s.id), 0) + 1;
    const newSuggestion = {
      ...suggestion,
      id: newId,
      date: new Date(),
      nbLikes: 0,
      status: 'en_attente' as const
    };
    this.suggestions.push(newSuggestion);
    this.saveSuggestions();
    this.showSuccess(`✨ Nouvelle suggestion ajoutée`);
  }

  // 🔹 Supprimer une suggestion
  deleteSuggestion(suggestion: Suggestion): void {
    if (confirm(`Voulez-vous supprimer "${suggestion.title}" ?`)) {
      // Supprimer des suggestions
      const suggestionIndex = this.suggestions.findIndex(s => s.id === suggestion.id);
      if (suggestionIndex !== -1) {
        this.suggestions.splice(suggestionIndex, 1);
      }
      
      // Supprimer des favoris si présent
      if (this.isFavorite(suggestion)) {
        this.removeFromFavorites(suggestion);
      }
      
      this.saveSuggestions();
      this.showSuccess(`🗑️ "${suggestion.title}" a été supprimé`);
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

  // ========================================
  // UTILITAIRES
  // ========================================

  // 🔹 Trier les suggestions (par date, likes, etc.)
  sortSuggestions(criteria: 'date' | 'likes' | 'title'): void {
    switch (criteria) {
      case 'date':
        this.suggestions.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'likes':
        this.suggestions.sort((a, b) => b.nbLikes - a.nbLikes);
        break;
      case 'title':
        this.suggestions.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    this.saveSuggestions();
    this.showSuccess(`Suggestions triées par ${criteria}`);
  }

  // 🔹 Exporter les données
  exportData(): void {
    const data = {
      suggestions: this.suggestions,
      favorites: this.favorites,
      exportDate: new Date()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suggestions-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.showSuccess('Données exportées avec succès');
  }
}