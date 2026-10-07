import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Servidor } from '../../model/servidor';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  selector: 'app-localizador-modal',
  styleUrl: './localizador-modal.css',
  templateUrl: './localizador-modal.html',
})
export class LocalizadorModal {

  constructor(
    public dialogRef: MatDialogRef<LocalizadorModal>,
    @Inject(MAT_DIALOG_DATA) public servidores: Servidor[]
  ) {}

  fecharModal(): void {
    this.dialogRef.close();
  }
}
