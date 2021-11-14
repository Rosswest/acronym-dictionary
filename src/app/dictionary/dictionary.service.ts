import { Injectable, OnInit } from '@angular/core';
import { DemoDictionaryPopulator } from './model/demo/demo-dictionary-populator';
import { Dictionary } from './model/dictionary';
import { Tag } from './model/tag';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  public dictionary: Dictionary;

  constructor() {
    this.dictionary = new Dictionary();
    this.populateDefaultDictionary();
  }

  populateDefaultDictionary() {
    const populator = new DemoDictionaryPopulator();
    populator.populateDictionary(this.dictionary);
  }

}
