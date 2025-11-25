import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacaoGps } from './visualizacao-gps';

describe('VisualizacaoGps', () => {
  let component: VisualizacaoGps;
  let fixture: ComponentFixture<VisualizacaoGps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizacaoGps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizacaoGps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
