import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyComponent } from './Company/company/company.component';
import { AddUpdateOrganizationComponent } from './Organization/add-update-organization/add-update-organization/add-update-organization.component';
import { SearchOrganizationComponent } from './Organization/search-organization/search-organization.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message'; // For individual messages
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { CandidatesComponent } from './Candidates /candidates/candidates.component';
import { OrganizationsComponent } from './Organization/organizations/organizations.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SerachCompanyComponent } from './Company/company/serach-company/serach-company.component';
import { AddUpdateCompanyComponent } from './Company/company/add-update-company/add-update-company.component';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    CompanyComponent,
    AddUpdateOrganizationComponent,
    SearchOrganizationComponent,
    CandidatesComponent,
    OrganizationsComponent,
    SerachCompanyComponent,
    AddUpdateCompanyComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    CardModule,
    HttpClientModule,
    DropdownModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule,
    MessagesModule,
    TabViewModule,
    TableModule,
    PaginatorModule,
    NgxSpinnerModule.forRoot(),
      ],
      providers: [ConfirmationService,MessageService,
        MessagesModule,],
      bootstrap: [AppComponent]
})
export class AppModule { }
