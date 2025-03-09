import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerachCompanyComponent } from './serach-company.component';

describe('SerachCompanyComponent', () => {
  let component: SerachCompanyComponent;
  let fixture: ComponentFixture<SerachCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SerachCompanyComponent]
    });
    fixture = TestBed.createComponent(SerachCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
