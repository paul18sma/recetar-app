import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalListComponent } from './professional-list.component';

describe('ProfessionalListComponent', () => {
  let component: ProfessionalListComponent;
  let fixture: ComponentFixture<ProfessionalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
