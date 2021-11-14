import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DictionaryService } from './dictionary.service';
import { Dictionary } from './model/dictionary';
import { DisplayableAcronym } from './model/displayable-acronym';
import { Tag } from './model/tag';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {

  public acronymFilter: string;
  public tagsFilter: Tag[];
  public descriptionFilter: string;
  public searching: boolean = false;
  
  suggestedTags: Tag[] = [];
  dictionary: Dictionary;
  searchResults: DisplayableAcronym[] = [];
  scrollTableHeight: string;

  @ViewChild('resultsGrid') gridElement: any;
  constructor(private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    this.dictionaryService.populateDefaultDictionary();
    this.fetchDictionary();
    this.search();
  }

  fetchDictionary(): void {
    this.dictionary = this.dictionaryService.dictionary;
  }

  filterTags(event: any) {
    const query: string = event.query;
    const queryLowerCase = query.toLowerCase();
    let matchingTags: Tag[] = [];
    for (const candidate of this.dictionary.tags) {
      const candidateName = candidate.name.toLowerCase();
      const matches = candidateName.includes(queryLowerCase);
      if (matches) {
        matchingTags.push(candidate);
      }
    }

    if (matchingTags.length >= 2) {
      matchingTags = matchingTags.sort((first: Tag, second: Tag) => {
        return first.name.localeCompare(second.name);
      });
    }


    this.suggestedTags = matchingTags;
  }

  search(): void {
    this.recalculateGridSize();   
    this.searchResults = this.dictionary.searchForDisplay(this.acronymFilter, this.tagsFilter, this.descriptionFilter);
  }

  recalculateGridSize() {
    const gridExists = !(this.gridElement === null || this.gridElement === undefined);
    if (gridExists) {
        const gridYOffset = this.gridElement.el.nativeElement.offsetTop;
        const documentHeight = document.documentElement.clientHeight;
        const newHeight = documentHeight - gridYOffset - 10;
        this.scrollTableHeight = newHeight + 'px';
      }
    }

}
