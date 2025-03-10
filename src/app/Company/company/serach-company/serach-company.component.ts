import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { PaginatorState } from 'primeng/paginator';
import { Company, SelectItem } from 'src/app/models/model';
import { CommonService } from 'src/app/Services/common-service.service';
import { CompanyService } from 'src/app/Services/company.service';
import { OrganizationService } from 'src/app/Services/organization.service';

@Component({
  selector: 'app-serach-company',
  templateUrl: './serach-company.component.html',
  styleUrls: ['./serach-company.component.css']
})
export class SerachCompanyComponent implements OnInit{
  @ViewChild('autoCompleteRef') autoCompleteRef!: AutoComplete;

  searchForm!:FormGroup;
  companies: Company[] = [];
  searchParams = {
    organizationName:'',
    companyName: '',
    companyCode: '',
    country:'',
    organizationId:null
  };
  isAddEditVisible = false;
  selectedCompany: Company | null = null;
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
  sortField: keyof Company = 'name'; // Default sort field
  sortOrder: number = 1; // 1 for ASC, -1 for DESC
  filteredOrganizations: SelectItem[] = [];
  organizatioList: SelectItem[] = []; // List of organizations from the API
  selectedOrganization: any = null;
   constructor(
      private fb: FormBuilder,
      private confirmationService: ConfirmationService, private cs:CommonService,
      private router: Router,private companyService:CompanyService,private organizationService:OrganizationService
    ) {}
  
    ngOnInit(): void {
      this.createForm();
      this.loadOrganizationsSuggest();
      this.loadOrganizations();
      this.bindEvents();
    }
    bindEvents() {
      const searchFormCtrls = (<any>this.searchForm).controls;
      const organizationName$ = searchFormCtrls.organizationName.valueChanges;

      organizationName$.subscribe((change: string | null) => {
        if (change === "") {
          this.searchParams.organizationId=null;
        }});
    }

     createForm(){
        this.searchForm = this.fb.group({
          organizationName: ['', Validators.required],
          companyCode:'',
          companyName:''
        });
      }

  // Show the add/edit section
  showAddEditSection() {
    this.isAddEditVisible = true;
    this.selectedCompany = null; // Reset selected organization for add mode
    this.router.navigate(['/company/add']);

  }

  showEditSection(company?: Company): void {
    this.selectedCompany = company || null;
    this.isAddEditVisible = true;
  }

  loadOrganizations(): void {
    this.cs.showOrHideSpinner(true);
    this.companyService.GetCompanyByCriteria(
        this.searchParams.companyName.trim(),
        this.searchParams.companyCode.trim(),
        this.searchParams.country, 
        this.searchParams.organizationId!,
        this.pageNumber,
        this.pageSize
      ).subscribe({
        next: (result) => {
          this.companies = result.data;
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
    this.companies.sort((a, b) => {
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
    this.selectedCompany = null; // Reset selected organization
    this.loadOrganizations(); // Refresh the list after adding/editing

  }

  // Edit an organization
  onEdit(company: Company) {
    this.selectedCompany = company; // Set the organization to edit
    this.isAddEditVisible = true; // Show the add/edit section
    this.showEditSection(company);
  }

  // Delete an organization
  onDelete(organization: Company) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected record',
      acceptLabel: 'Yes', 
      rejectLabel: 'No',
      accept: () => {
        this.companyService.deleteCompany(organization.id).subscribe(response=>{
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

  filterOrganizations(event: any) {
    const query = event.query; // Get the user's input
    this.filteredOrganizations = this.organizatioList.filter((org) =>
      org.label.toLowerCase().includes(query.toLowerCase()))
}

  loadOrganizationsSuggest() {
    this.organizationService.GetOrganizationSuggest().subscribe((response) => {
      if(response.succeeded){
        this.organizatioList = response.data;
      }
        });
}

onOrganizationSelect(event: any) {
  if (event && event.value) {
    this.searchParams.organizationId = event.value.value;
  }
}

  goToHome(){
    this.router.navigate(['/candidates']);  
  }
  // Search organizations
  onSearch() {
    this.setSerchModel();
    this.cs.showOrHideSpinner(true);
    this.pageNumber = 1; // Reset to the first page when searching
    this.loadOrganizations();
  }

  setSerchModel(){
    const formValues = this.searchForm.value;
    this.searchParams.organizationId = formValues.organizationName.value; 
    this.searchParams.companyName = formValues.companyName; 
    this.searchParams.companyCode = formValues.companyCode; 

  }

  onPageChange(event: any): void {
    const paginatorState = event as PaginatorState; // Cast the event to PaginatorState
    this.pageNumber = paginatorState.page! + 1; // Update page number
    this.pageSize = paginatorState.rows!; // Update page size
    this.loadOrganizations();
  }

   // Clear the selected organization
   clearSelectedOrganization() {
    this.searchForm.get('organizationName')!.setValue(null); // Clear the form control
    this.filteredOrganizations = []; // Clear the filtered list (optional)
}

}
