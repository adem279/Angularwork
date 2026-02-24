import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // ← AJOUTÉ
import { Suggestion } from '../../models/suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  
  // URL de l'API  ← AJOUTÉ
  private apiUrl = 'http://localhost:3000/suggestions';

  // Liste des suggestions
  private suggestionList: Suggestion[] = [
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

  constructor(private http: HttpClient) { }  // ← MODIFIÉ

  // Méthode pour retourner la liste des suggestions (statique)
  getSuggestionsList(): Suggestion[] {
    return this.suggestionList;
  }

  // NOUVELLE méthode pour appeler l'API  ← AJOUTÉ
  getSuggestionsFromApi() {
    return this.http.get(this.apiUrl);
  }
}