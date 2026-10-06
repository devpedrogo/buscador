import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Servidor } from '../../model/servidor';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-localizador-modal',
  styleUrl: './localizador-modal.css',
  templateUrl: './localizador-modal.html',
})
export class LocalizadorModal {

  @Input() isOpen = false;
  @Input() servidores: Servidor[] = [];
  @Output() close = new EventEmitter<void>();

  fecharModal(): void {
    this.close.emit();
  }
}
