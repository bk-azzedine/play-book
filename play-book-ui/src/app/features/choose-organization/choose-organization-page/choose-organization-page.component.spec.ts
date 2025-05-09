import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOrganizationPageComponent } from './choose-organization-page.component';

describe('ChooseOrganizationPageComponent', () => {
  let component: ChooseOrganizationPageComponent;
  let fixture: ComponentFixture<ChooseOrganizationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseOrganizationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseOrganizationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
