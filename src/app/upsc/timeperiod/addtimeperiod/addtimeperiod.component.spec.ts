import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtimeperiodComponent } from './addtimeperiod.component';

describe('AddtimeperiodComponent', () => {
  let component: AddtimeperiodComponent;
  let fixture: ComponentFixture<AddtimeperiodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddtimeperiodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddtimeperiodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
