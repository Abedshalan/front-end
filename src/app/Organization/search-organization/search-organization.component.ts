import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-search-organization',
  templateUrl: './search-organization.component.html',
  styleUrls: ['./search-organization.component.css']
})
export class SearchOrganizationComponent {
   constructor(
      private fb: FormBuilder,
      private confirmationService: ConfirmationService,
      private router: Router
    ) {}
  
  organizations = [
    { id: 1, code: 'ORG1', name: 'Organization 1', phone: '123-456-7890' },
    { id: 2, code: 'ORG2', name: 'Organization 2', phone: '987-654-3210' },
  ];

  isAddEditVisible = false; // Controls visibility of the add/edit section
  selectedOrganization: any = null; // Stores the organization being edited
  searchParams = { organizationName: '', organizationCode: '' }; // Search parameters

  // Show the add/edit section
  showAddEditSection() {
    this.isAddEditVisible = true;
    this.selectedOrganization = null; // Reset selected organization for add mode
    this.router.navigate(['/organization/add']);

  }

  // Hide the add/edit section
  hideAddEditSection() {
    this.isAddEditVisible = false;
    this.selectedOrganization = null; // Reset selected organization
  }

  // Edit an organization
  onEdit(organization: any) {
    this.selectedOrganization = organization; // Set the organization to edit
    this.isAddEditVisible = true; // Show the add/edit section
  }

  // Delete an organization
  onDelete(organization: any) {
    // Logic to delete organization
  }

  // Search organizations
  onSearch() {
    // Logic to filter organizations based on searchParams
  }
}
