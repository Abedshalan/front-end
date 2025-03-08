import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateOrganizationComponent } from './add-update-organization.component';

describe('AddUpdateOrganizationComponent', () => {
  let component: AddUpdateOrganizationComponent;
  let fixture: ComponentFixture<AddUpdateOrganizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpdateOrganizationComponent]
    });
    fixture = TestBed.createComponent(AddUpdateOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
