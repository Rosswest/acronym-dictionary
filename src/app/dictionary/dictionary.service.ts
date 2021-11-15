import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DemoDictionaryPopulator } from './model/demo/demo-dictionary-populator';
import { Dictionary } from './model/dictionary';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private httpClient: HttpClient) { }

  getRemoteDictionary(): Observable<Dictionary> {
    return this.httpClient.get(environment.dictionary_url, { responseType: 'json' }).pipe(map((dictionaryData => {
      // strictly speaking not a dictionary object (just json) but dictionary has no real functionality
      const dictionary = Dictionary.fromJSON(dictionaryData);
      return dictionary;
    })));
  }

  getDemoDictionary(): Dictionary {
    const dictionary = new Dictionary();
    const populator = new DemoDictionaryPopulator();
    populator.populateDictionary(dictionary);
    return dictionary;
  }

}
