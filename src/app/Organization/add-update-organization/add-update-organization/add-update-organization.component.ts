import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Organization } from 'src/app/models/model';
import { OrganizationService } from 'src/app/Services/organization.service';

@Component({
  selector: 'app-add-update-organization',
  templateUrl: './add-update-organization.component.html',
  styleUrls: ['./add-update-organization.component.css'],
  providers: [MessageService]
})
export class AddUpdateOrganizationComponent implements OnInit {
  @Input() organization: any; // Input for edit mode
  @Output() cancel = new EventEmitter<void>(); // Event to cancel and hide the section
  organizationForm!: FormGroup;  
  organizationName: string = '';
  filteredCountries: string[] = [];
  countries: string[] = ['USA', 'Canada', 'UK', 'Germany']; // Example countries

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,private router: Router
  ) {}

  ngOnInit(): void {
    this.organizationForm = this.fb.group({
      organizationName: ['', Validators.required],
      organizationCode: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      fullAddress: ['', Validators.required],
      creationDate: [{ value: '', disabled: true }],
      updatingDate: [{ value: '', disabled: true }]  
    });
  }

  filterCountries(event: any) {
    this.filteredCountries = this.countries.filter(country =>
      country.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  onBack() {
    this.confirmationService.confirm({
      message: 'You haven\'t saved your changes yet. Do you want to leave without saving?',
      acceptLabel: 'Leave this page', 
      rejectLabel: 'Stay on this page',
      accept: () => {
        this.router.navigate(['/organization']);

      },
      reject: () => {
        // "Stay on this page"
      },
    });
  }
  
  onSave() {
    if (this.organizationForm.valid) {
      // Call API to save organization
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Organization saved successfully' });
      this.cancel.emit(); // Hide the add/edit section after saving

    }
  }

  onCancel() {
    this.onBack();
    this.cancel.emit(); // Hide the add/edit section

  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Organization saved successfully',
    });
  }
}
