import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JishoDictionaryEntry } from 'src/app/models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  constructor(private http: HttpClient) {}

  public getEntry(keyword: string) {
    console.log('look up keyword', keyword, 'in dictionary');
    const url = `/api/v1/search/words?keyword=${keyword}`;
    console.log('get', url);
    return this.http.get<JishoDictionaryEntry>(url);
  }
}
