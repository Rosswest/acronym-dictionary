import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { environment } from 'src/environments/environment';
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

  /* Active filter data*/
  public acronymFilter: string;
  public tagsFilter: Tag[];
  public tagFilterMode: TagFilterMode;
  public descriptionFilter: string;

  /* Page State*/
  public searching: boolean = false;
  public fetchedDictionary: boolean = false;

  /* Page Data*/
  public tagFilterModes: any[] = [TagFilterMode.ANY, TagFilterMode.ALL, TagFilterMode.ONLY];
  public suggestedTags: Tag[] = [];
  public dictionary: Dictionary;
  public searchResults: DisplayableAcronym[] = [];
  public scrollTableHeight: string;

  /* Grid */
  private gridSizeSet: boolean = false;
  public sorting: boolean = false;
  @ViewChild('resultsGrid') gridElement: Table;

  constructor(private dictionaryService: DictionaryService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.tagFilterMode = TagFilterMode.ANY;
    this.fetchDictionary();
  }

  ngAfterViewChecked(): void {
    if (!this.gridSizeSet) {
      const gridExists = !(this.gridElement === null || this.gridElement === undefined);
      if (gridExists) {
        this.recalculateGridSize();
      }
      this.ref.detectChanges();
    }
  }

  fetchDictionary(): void {
    if (environment.generateLocalDictionary) {
      this.dictionary = this.dictionaryService.getDemoDictionary();
    } else {
      this.dictionaryService.getRemoteDictionary().subscribe((dictionary) => {
        this.dictionary = dictionary;
        this.fetchedDictionary = true;
        this.search();

        // trigger a size refresh just in case something has gone wrong with the window at start up that
        // may have messed with our size calculation
        setTimeout(() => {
          this.recalculateGridSize();
        }, 100);
      });
    }

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
    this.searchResults = this.dictionary.searchForDisplay(this.acronymFilter, this.tagsFilter, this.tagFilterMode, this.descriptionFilter);
    this.recalculateGridSize();
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

  onSort(event: any) {
    this.sorting = true;
  }

  clearSort(event: any) {
    event.stopPropagation(); // stop the click triggering the filter the header click
    this.sorting = false;
    this.gridElement.sortOrder = 0;
    this.gridElement.sortField = '';
    this.gridElement.reset();
  }
}
