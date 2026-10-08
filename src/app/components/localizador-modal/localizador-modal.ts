import { Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { Servidor } from '../../model/servidor';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';


@Component({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    ClipboardModule
  ],
  selector: 'app-localizador-modal',
  styleUrl: './localizador-modal.css',
  templateUrl: './localizador-modal.html',
})
export class LocalizadorModal {

  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<LocalizadorModal>,
    @Inject(MAT_DIALOG_DATA) public servidores: Servidor[]
  ) {}

  copiarTexto(texto: string, label: string): void {
    if (!texto) return;

    this.clipboard.copy(texto);

    this.snackBar.open(`${label} copiado!`, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  fecharModal(): void {
    this.dialogRef.close();
  }
}
