import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Organization } from 'src/app/models/model';
import { CommonService } from 'src/app/Services/common-service.service';
import { OrganizationService } from 'src/app/Services/organization.service';

@Component({
  selector: 'app-search-organization',
  templateUrl: './search-organization.component.html',
  styleUrls: ['./search-organization.component.css']
})
export class SearchOrganizationComponent implements OnInit{
  organizations: Organization[] = [];
  searchParams = {
    organizationName: '',
    organizationCode: '',
    country:''
  };
  isAddEditVisible = false;
  selectedOrganization: Organization | null = null;
  filteredCountries: any[] = [];
  countries = [
    { name: 'Jordan' },
    { name: 'UAE' },
    { name: 'United Kingdom' },
    { name: 'Germany' },
    { name: 'United States' },
    { name: 'Canada' },
  ];
 // Pagination
  pageNumber:number = 1;
  pageSize:number = 10;
  totalCount?:number = 0;
  totalPages?:number = 0;
  // Sorting
  sortField: keyof Organization = 'name'; // Default sort field
  sortOrder: number = 1; // 1 for ASC, -1 for DESC

   constructor(
      private fb: FormBuilder,
      private confirmationService: ConfirmationService, private cs:CommonService,
      private router: Router,private organizationService:OrganizationService
    ) {}
  
    ngOnInit(): void {
      this.loadOrganizations();
    }

  // Show the add/edit section
  showAddEditSection() {
    this.isAddEditVisible = true;
    this.selectedOrganization = null; // Reset selected organization for add mode
    this.router.navigate(['/organization/add']);

  }

  showEditSection(organization?: Organization): void {
    this.selectedOrganization = organization || null;
    this.isAddEditVisible = true;
  }

  loadOrganizations(): void {
    this.cs.showOrHideSpinner(true);
    this.organizationService
      .GetOrganizationByCriteria(
        this.searchParams.organizationName.trim(),
        this.searchParams.organizationCode.trim(),
        this.searchParams.country, 
        this.pageNumber,
        this.pageSize
      )
      .subscribe({
        next: (result) => {
          this.organizations = result.data;
          this.totalCount = result.totalCount;
          this.totalPages = result.totalPages;
          this.cs.showOrHideSpinner(false);
        },
        error: (error) => {
          console.error('Error loading organizations:', error);
          this.cs.showOrHideSpinner(false);
        }
      });
    }

    filterCountries(event: any) {
      const query = event.query;
      this.filteredCountries = this.countries.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase())
      );
    }

  onSort(event: any): void {
    console.log('SortEvent:', event);
    this.organizations.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  // Update the country directly when selected
  onCountrySelect(event: any) {
  // If a country is selected, assign the country name to searchParams.country
  if (event && event.value) {
    this.searchParams.country = event.value.name;
  }
  }
  // Hide the add/edit section
  hideAddEditSection() {
    this.isAddEditVisible = false;
    this.selectedOrganization = null; // Reset selected organization
    this.loadOrganizations(); // Refresh the list after adding/editing

  }

  // Edit an organization
  onEdit(organization: Organization) {
    this.selectedOrganization = organization; // Set the organization to edit
    this.isAddEditVisible = true; // Show the add/edit section
    this.showEditSection(organization);
  }

  // Delete an organization
  onDelete(organization: Organization) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected record',
      acceptLabel: 'Yes', 
      rejectLabel: 'No',
      accept: () => {
        this.organizationService.deleteOrganization(organization.id).subscribe(response=>{
          if(response.succeeded){
            this.cs.pushMessage('success', "Success", response.msg!)
            this.onSearch();
          }else{
            this.cs.showOrHideSpinner(false);
          }
        } , err => {
          this.cs.showOrHideSpinner(false);
          this.cs.pushMessage('error', "Error", err);
        })
      },
      reject: () => {
        
      },
    });
  }

  goToHome(){
    this.router.navigate(['/candidates']);  
  }
  // Search organizations
  onSearch() {
    this.cs.showOrHideSpinner(true);
    this.pageNumber = 1; // Reset to the first page when searching
    this.loadOrganizations();

  }

  onPageChange(event: any): void {
    const paginatorState = event as PaginatorState; // Cast the event to PaginatorState
    this.pageNumber = paginatorState.page! + 1; // Update page number
    this.pageSize = paginatorState.rows!; // Update page size
    this.loadOrganizations();
  }

}
