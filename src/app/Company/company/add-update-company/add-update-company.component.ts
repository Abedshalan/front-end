import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Company, SelectItem } from 'src/app/models/model';
import { CommonService } from 'src/app/Services/common-service.service';
import { CompanyService } from 'src/app/Services/company.service';
import { OrganizationService } from 'src/app/Services/organization.service';

@Component({
  selector: 'app-add-update-company',
  templateUrl: './add-update-company.component.html',
  styleUrls: ['./add-update-company.component.css']
})
export class AddUpdateCompanyComponent implements OnInit,OnChanges {
  @Input() company!: Company; // Input for edit mode
  @Output() cancel = new EventEmitter<void>(); // Event to cancel and hide the section
  companyForm!: FormGroup;
  companyName: string =  '';
  companyModel:Company = new Company();
  filteredCountries: any[] = [];
  filteredOrganizations: SelectItem[] = [];
  organizatioList: SelectItem[] = []; // List of organizations from the API
  selectedOrganization: any = null;
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
    private confirmationService: ConfirmationService, private commonService:CommonService, private organizationService :OrganizationService,
    private messageService: MessageService,private router: Router,private companyService:CompanyService
  ) {}

  ngOnInit(): void {
  this.createForm();
  this.loadOrganizationsSuggest();
  if (this.company) {
    this.setFormValues(); // Set form values if organization is provided
   }
  }

  ngOnChanges() {
    if (this.companyForm && this.company) {
      this.setFormValues(); // Update form values when organization changes
    }
  }

  createForm(){
    this.companyForm = this.fb.group({
      organizationName: ['', Validators.required],
      companyName:['', Validators.required],
      companyCode: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      fullAddress: ['', Validators.required],
      creationDate: [{ value: '', disabled: true }],
      updatingDate: [{ value: '', disabled: true }]  
    });
  }

  setFormValues(): void {
    this.companyName = this.company.name
    this.companyForm.patchValue({
      companyCode: this.company.code,
      country: this.company.country,
      phone: this.company.phone,
      fullAddress: this.company.fullAddress,
      creationDate:this.company.creationDate,
      updatingDate: this.company.updatingDate
    });
    if(this.company.organizationId >0)
    this.GetOrganizationNameyId(this.company.organizationId.toString())
  }

  filterCountries(event: any) {
    const query = event.query; // Get the user's input
    this.filteredCountries = this.countries.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
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
  this.selectedOrganization = event.value
}

getOrganizationDetails(){
  const selectedOrganization = this.companyForm.get('organizationName')!.value;

  // Check if any fields are already filled
  const isFormPartiallyFilled =
      this.companyForm.get('phone')!.value ||
      this.companyForm.get('country')!.value ||
      this.companyForm.get('fullAddress')!.value;

  if (isFormPartiallyFilled) {
      // Show confirmation dialog
      this.confirmationService.confirm({
          message:
              'The system will override all company details according to the predefined information on the organization level. Are you sure you want to continue?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.fillOrganizationDetails(selectedOrganization);
          },
          reject: () => {
              this.messageService.add({
                  severity: 'info',
                  summary: 'Cancelled',
                  detail: 'Operation aborted.',
              });
          },
      });
  } else {
      // Fill details without confirmation
      this.fillOrganizationDetails(selectedOrganization);
  }

}

fillOrganizationDetails(organization: any) {
  this.commonService.showOrHideSpinner(true);
  // Fetch organization details from the API
  this.organizationService.getOrganizationById(organization.value).subscribe((response) => {
    if(response.data){
      this.companyForm.patchValue({
        phone: response.data.phone,
        country: response.data.country,
        fullAddress: response.data.fullAddress,
    });
    this.commonService.showOrHideSpinner(false);
    this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Organization details filled successfully.',
    });
    }
  }, err => {
    this.commonService.showOrHideSpinner(false);
  });
  this.commonService.showOrHideSpinner(false);
}

  onBack() {
    this.confirmationService.confirm({
      message: 'You haven\'t saved your changes yet. Do you want to leave without saving?',
      acceptLabel: 'Leave this page', 
      rejectLabel: 'Stay on this page',
      accept: () => {
        this.companyForm.reset();
        this.router.navigate(['/company']);
        this.onBack();
        this.cancel.emit(); // Hide the add/edit section
      },
      reject: () => {
        // "Stay on this page"
      },
    });
  }
  
  onSave() {
    if (this.companyForm.valid) {
      this.commonService.showOrHideSpinner(true);
      this. setModelValues();
      this.companyService.addCompany(this.companyModel).subscribe(response=>{
        if(response.succeeded){
          this.commonService.pushMessage('success', "Success", response.msg!)
          this.cancel.emit(); // Hide the addsection after saving
          this.companyForm.reset();
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
    if (this.companyForm.valid) {
      this.commonService.showOrHideSpinner(true);
      this. setModelValues();  
      this.companyService.updateCompany(this.companyModel).subscribe(response => {
      if (response.succeeded) {
        this.companyForm.patchValue({
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
    const formValues = this.companyForm.value;
    this.companyModel.organizationId = formValues.organizationName.value; 
    this.companyModel.name = formValues.companyName; 
    this.companyModel.code = formValues.companyCode; 
    this.companyModel.country = formValues.country.name == undefined?formValues.country:formValues.country.name; 
    this.companyModel.phone = formValues.phone.toString(); 
    this.companyModel.fullAddress = formValues.fullAddress; 
    this.companyModel.organization = undefined;
    if (this.company) {
      this.companyModel.id = this.company.id; // Preserve the ID for updates
    }
  }
   
  GetOrganizationNameyId(id: string) {
    if (id) {
      this.commonService.showOrHideSpinner(true);
      this.organizationService.getOrganizationById(id).subscribe(response => {
        if (response.data && response.data != null) {
          this.companyForm.get("organizationName")!.patchValue({ label: response.data.name, value: response.data.id });
          this.commonService.showOrHideSpinner(false);

        }
      });
    }
  }
}
