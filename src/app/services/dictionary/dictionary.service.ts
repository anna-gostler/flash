import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JishoDictionaryEntry } from 'src/app/models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  constructor(private http: HttpClient) {}

  public getEntry(keyword: string) {
    console.log(
      'Get dictionary entry. keyword:',
      keyword,
      'isDevMode:',
      isDevMode()
    );

    if (isDevMode()) {
      return this.http.get<JishoDictionaryEntry[]>(
        `http://localhost:8080/dict?keyword=${keyword}`
      );
    } else {
      return this.http.get<JishoDictionaryEntry[]>(
        `https://flash-app.herokuapp.com/dict?keyword=${keyword}`
      );
    }
  }
}
