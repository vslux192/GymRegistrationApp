import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRegistrationComponent } from './create-registration.component';

describe('CreateRegistrationComponent', () => {
  let component: CreateRegistrationComponent;
  let fixture: ComponentFixture<CreateRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRegistrationComponent]
    });
    fixture = TestBed.createComponent(CreateRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
