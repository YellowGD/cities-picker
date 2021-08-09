import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  const MockSnackBarData = {
    info: {
      explanation: 'an explanation',
      message: 'an error',
      recommendation: 'a recommendation'
    },
    closeText: 'OK'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorMessageComponent ],
      imports: [
        MatSnackBarModule
      ],
      providers: [
        { provide: MatSnackBarRef, useValue: null },
        { provide: MAT_SNACK_BAR_DATA, useValue: MockSnackBarData }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
