import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Suggestion } from '../../models/suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  
  private apiUrl = 'http://localhost:3000/suggestions';

  private suggestionList: Suggestion[] = [
    // ... votre liste existante ...
  ];

  constructor(private http: HttpClient) { }

  getSuggestionsList(): Suggestion[] {
    return this.suggestionList;
  }

  getSuggestionsFromApi() {
    return this.http.get(this.apiUrl);
  }

  getSuggestionById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  deleteSuggestion(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addSuggestion(suggestion: any) {
    return this.http.post(this.apiUrl, suggestion);
  }

  // ✅ NOUVELLE MÉTHODE
  updateSuggestion(id: number, suggestion: any) {
    return this.http.put(`${this.apiUrl}/${id}`, suggestion);
  }
}