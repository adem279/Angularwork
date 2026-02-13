import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {
  suggestionId: number = 0;
  suggestion: any;

  // Liste simulée - remplacez par votre service plus tard
  suggestions = [
    {
      id: 1,
      title: "Organiser une journée team building",
      category: "Événements",
      description: "Suggestion pour organiser une journée de team building pour renforcer les liens entre les membres de l'équipe.",
      status: "accepted",
      date: "20/01/2025",
      likes: 18
    },
    {
      id: 2,
      title: "Améliorer le système de réservation",
      category: "Technologie",
      description: "Proposition pour améliorer la gestion des réservations en ligne.",
      status: "pending",
      date: "15/01/2025",
      likes: 40
    },
    {
      id: 3,
      title: "Créer un espace de détente",
      category: "Aménagement",
      description: "Aménager un espace de détente avec des jeux et canapés.",
      status: "rejected",
      date: "10/01/2025",
      likes: 12
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    this.route.params.subscribe(params => {
      this.suggestionId = +params['id']; // Le + convertit en number
      this.loadSuggestion();
    });
  }

  loadSuggestion(): void {
    this.suggestion = this.suggestions.find(s => s.id === this.suggestionId);
  }

  goBack(): void {
    this.router.navigate(['/suggestions']);
  }
}