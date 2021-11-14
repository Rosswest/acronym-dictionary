import { AfterViewChecked, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DictionaryService } from './dictionary.service';
import { TagFilterMode } from './model/demo/tag-filter-mode';
import { Dictionary } from './model/dictionary';
import { DisplayableAcronym } from './model/displayable-acronym';
import { Tag } from './model/tag';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit, AfterViewChecked {

  public acronymFilter: string;
  public tagsFilter: Tag[];
  public tagFilterMode: TagFilterMode;
  public descriptionFilter: string;
  public searching: boolean = false;

  public tagFilterModes: any[] = [TagFilterMode.ANY, TagFilterMode.ALL];
  public suggestedTags: Tag[] = [];
  public dictionary: Dictionary;
  public searchResults: DisplayableAcronym[] = [];
  public scrollTableHeight: string;

  private gridSizeSet: boolean = false;
  @ViewChild('resultsGrid') gridElement: any;

  constructor(private dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    this.dictionaryService.populateDefaultDictionary();
    this.tagFilterMode = TagFilterMode.ANY;
    this.fetchDictionary();
    this.search();
    this.recalculateGridSize();
  }

  ngAfterViewChecked(): void {
    if (!this.gridSizeSet) {
      const gridExists = !(this.gridElement === null || this.gridElement === undefined);
      if (gridExists) {
        this.recalculateGridSize();
      }
    }

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
    this.searchResults = this.dictionary.searchForDisplay(this.acronymFilter, this.tagsFilter, this.tagFilterMode, this.descriptionFilter);
  }

  recalculateGridSize() {
    const gridExists = !(this.gridElement === null || this.gridElement === undefined);
    if (gridExists) {
      const gridYOffset = this.gridElement.el.nativeElement.offsetTop;
      const documentHeight = document.documentElement.clientHeight;
      const newHeight = documentHeight - gridYOffset - 10;
      this.scrollTableHeight = newHeight + 'px';
      this.gridSizeSet = true;
    }
  }

}
