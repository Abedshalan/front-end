import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Organization } from 'src/app/models/model';
import { CommonService } from 'src/app/Services/common-service.service';
import { OrganizationService } from 'src/app/Services/organization.service';

@Component({
  selector: 'app-add-update-organization',
  templateUrl: './add-update-organization.component.html',
  styleUrls: ['./add-update-organization.component.css'],
  providers: [MessageService]
})
export class AddUpdateOrganizationComponent implements OnInit,OnChanges {
  @Input() organization!: Organization; // Input for edit mode
  @Output() cancel = new EventEmitter<void>(); // Event to cancel and hide the section
  organizationForm!: FormGroup;
  organizationName: string =  '';
  organizationModel:Organization = new Organization();
  filteredCountries: any[] = [];
countries = [
    { name: 'Jordan' },
    { name: 'UAE' },
    { name: 'United Kingdom' },
    { name: 'Germany' },
    { name: 'United States' },
    { name: 'Canada' },
  ];
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService, private commonService:CommonService,
    private messageService: MessageService,private router: Router,private organizationService:OrganizationService
  ) {}

  ngOnInit(): void {
  this.createForm();
  if (this.organization) {
    this.setFormValues(); // Set form values if organization is provided
   }
  }

  ngOnChanges() {
    if (this.organizationForm && this.organization) {
      this.setFormValues(); // Update form values when organization changes
    }
  }

  createForm(){
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

  setFormValues(): void {
    this.organizationName = this.organization.name
    this.organizationForm.patchValue({
      organizationCode: this.organization.code,
      country: this.organization.country,
      phone: this.organization.phone,
      fullAddress: this.organization.fullAddress,
      creationDate: this.organization.creationDate,
      updatingDate: this.organization.updatingDate
    });
  }

  filterCountries(event: any) {
    const query = event.query; // Get the user's input
    this.filteredCountries = this.countries.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  onBack() {
    this.confirmationService.confirm({
      message: 'You haven\'t saved your changes yet. Do you want to leave without saving?',
      acceptLabel: 'Leave this page', 
      rejectLabel: 'Stay on this page',
      accept: () => {
        this.organizationForm.reset();
        this.router.navigate(['/organization']);
        this.onBack();
        this.cancel.emit(); // Hide the add/edit section
      },
      reject: () => {
        // "Stay on this page"
      },
    });
  }
  
  onSave() {
    if (this.organizationForm.valid) {
      this.commonService.showOrHideSpinner(true);
      this. setModelValues();
      this.organizationService.addOrganization(this.organizationModel).subscribe(response=>{
        if(response.succeeded){
          this.commonService.pushMessage('success', "Success", response.msg!)
          this.cancel.emit(); // Hide the addsection after saving
          this.organizationForm.reset();
          this.commonService.showOrHideSpinner(false);
        }else{
          this.commonService.showOrHideSpinner(false);
        }
      } , err => {
        this.commonService.showOrHideSpinner(false);
        this.commonService.pushMessage('error', "Error", err);
      })
    }
  }

  onUpdate() {
    if (this.organizationForm.valid) {
      this.commonService.showOrHideSpinner(true);
      this. setModelValues();  
      this.organizationService.updateOrganization(this.organizationModel).subscribe(response => {
      if (response.succeeded) {
        this.organizationForm.patchValue({
          updatingDate: response.data.updatingDate

        })
        this.commonService.showOrHideSpinner(false);
        this.commonService.pushMessage('success', "Success",response.msg!);
      } else {
        this.commonService.showOrHideSpinner(false);
      }
    }, err => {
      this.commonService.showOrHideSpinner(false);
      this.commonService.pushMessage('error', "Error", err);
    })
   }
  }

  onCancel() {
    this.onBack();
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Organization saved successfully',
    });
  }

  setModelValues(){
    const formValues = this.organizationForm.value;
    this.organizationModel.name = formValues.organizationName; 
    this.organizationModel.code = formValues.organizationCode; 
    this.organizationModel.country = formValues.country.name; 
    this.organizationModel.phone = String(formValues.phone); 
    this.organizationModel.fullAddress = formValues.fullAddress; 
    this.organizationModel.companies = [];
    if (this.organization) {
      this.organizationModel.id = this.organization.id; // Preserve the ID for updates
    }
  }
   
}
