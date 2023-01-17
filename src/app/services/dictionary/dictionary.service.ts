import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JishoDictionaryEntry } from 'src/app/models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  constructor(private http: HttpClient) {}

  public getEntry(keyword: string) {
    // TODO choose url based on environment   
    return this.http.get<JishoDictionaryEntry[]>(
      `https://flash-app.herokuapp.com/dict?keyword=${keyword}`
    );
    //return this.http.get<JishoDictionaryEntry[]>(
    //  `http://localhost:8080/dict?keyword=${keyword}`
    //);
  }
}
