import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizadorModal } from './localizador-modal';

describe('LocalizadorModal', () => {
  let component: LocalizadorModal;
  let fixture: ComponentFixture<LocalizadorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalizadorModal],
    }).compileComponents();

    fixture = TestBed.createComponent(LocalizadorModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
