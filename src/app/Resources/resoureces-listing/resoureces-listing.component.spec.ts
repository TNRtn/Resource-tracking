import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourecesListingComponent } from './resoureces-listing.component';

describe('ResourecesListingComponent', () => {
  let component: ResourecesListingComponent;
  let fixture: ComponentFixture<ResourecesListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourecesListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourecesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
