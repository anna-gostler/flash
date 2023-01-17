import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JishoDictionaryEntry } from 'src/app/models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  constructor(private http: HttpClient) {}

  public getEntry(keyword: string) {
    return this.http.get<JishoDictionaryEntry[]>(
      `http://localhost:8080/dict?keyword=${keyword}`
    );
  }
}
