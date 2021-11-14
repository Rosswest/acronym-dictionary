import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryComponent } from './dictionary.component';
import { DictionaryService } from './dictionary.service';
import { DictionaryRoutingModule } from './dictionary-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
  declarations: [
    DictionaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DictionaryRoutingModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
    TableModule,
    SelectButtonModule,
    FileUploadModule
  ],
  providers: [
    DictionaryService
  ]
})
export class DictionaryModule { }
