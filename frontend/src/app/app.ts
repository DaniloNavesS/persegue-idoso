import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly title = signal('frontend');

  // Controls mobile sidebar visibility (and acts as expand toggle on small screens)
  readonly isSidebarOpen = signal(false);

  // Accordion state for GPS group
  readonly isGpsOpen = signal(true);
  
  // Accordion state for Configurações group
  readonly isConfiguracoesOpen = signal(false);
  
  // Accordion state for Informações do Paciente group
  readonly isInformacoesPacienteOpen = signal(false);
  
  // Accordion state for Avisos group
  readonly isAvisosOpen = signal(false);

  constructor() {}

  toggleSidebar(): void {
    this.isSidebarOpen.update((current) => !current);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleGps(): void {
    this.isGpsOpen.update((current) => !current);
  }

  toggleConfiguracoes(): void {
    this.isConfiguracoesOpen.update((current) => !current);
  }

  toggleInformacoesPaciente(): void {
    this.isInformacoesPacienteOpen.update((current) => !current);
  }

  toggleAvisos(): void {
    this.isAvisosOpen.update((current) => !current);
  }

  // Accordion header now only toggles open/close via toggleGps()
}
