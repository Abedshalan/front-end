import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateOrganizationComponent } from './Organization/add-update-organization/add-update-organization/add-update-organization.component';
import { SearchOrganizationComponent } from './Organization/search-organization/search-organization.component';
import { CandidatesComponent } from './Candidates /candidates/candidates.component';
import { CompanyComponent } from './Company/company/company.component';
import { OrganizationsComponent } from './Organization/organizations/organizations.component';

const routes: Routes = [
  { path: 'candidates', component: CandidatesComponent },
  { path: 'organization', component: OrganizationsComponent },
  { path: 'organization/add', component: AddUpdateOrganizationComponent },
  { path: 'organization/edit/:id', component: AddUpdateOrganizationComponent },
  { path: 'organization-list', component: SearchOrganizationComponent },
  { path: 'company', component: CompanyComponent },
  { path: '', redirectTo: '/candidates', pathMatch: 'full' }, // Default route
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
