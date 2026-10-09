import { Component, computed, EventEmitter, inject, Inject, Input, Output, signal } from '@angular/core';
import { Servidor } from '../../model/servidor';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatChipsModule,
    ClipboardModule
  ],
  selector: 'app-localizador-modal',
  styleUrl: './localizador-modal.css',
  templateUrl: './localizador-modal.html',
})
export class LocalizadorModal {

  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);

  // Unidade selecionada para filtro ('TODAS' é o padrão)
  readonly FILTRO_TODAS = 'TODAS';

  readonly unidadeSelecionada = signal<string>(this.FILTRO_TODAS);

  constructor(
    public dialogRef: MatDialogRef<LocalizadorModal>,
    @Inject(MAT_DIALOG_DATA) public servidores: Servidor[]
  ) {}

  /**
   * Mapeia as unidades presentes nos resultados e contabiliza os servidores.
   * Utiliza Map para garantir tipagem forte e performance de aglomeração.
   */
  readonly unidadesComContagem = computed<UnidadeContador[]>(() => {
    if (!this.servidores?.length) return [];

    const mapaContagem = new Map<string, number>();

    for (const servidor of this.servidores) {
      const sigla = this.obterIdentificadorUnidade(servidor);
      const totalAtual = mapaContagem.get(sigla) ?? 0;
      mapaContagem.set(sigla, totalAtual + 1);
    }

    return Array.from(mapaContagem.entries())
      .map(([sigla, quantidade]) => ({ sigla, quantidade }))
      .sort((a, b) => a.sigla.localeCompare(b.sigla));
  });

  readonly temMultiplasUnidades = computed<boolean>(() => {
    return this.unidadesComContagem().length > 1;
  });

  /**
   * Retorna os servidores filtrados pela pílula de unidade selecionada.
   */
  readonly servidoresFiltrados = computed<Servidor[]>(() => {
    const siglaSelecionada = this.unidadeSelecionada();

    if (siglaSelecionada === this.FILTRO_TODAS) {
      return this.servidores ?? [];
    }

    return (this.servidores ?? []).filter(
      servidor => this.obterIdentificadorUnidade(servidor) === siglaSelecionada
    );
  });

  /**
   * Atualiza o Signal da unidade selecionada.
   */
  selecionarUnidade(sigla: string): void {
    this.unidadeSelecionada.set(sigla);
  }

  /**
   * Helper encapsulado para garantir consistência na obtenção da chave da unidade.
   */
  private obterIdentificadorUnidade(servidor: Servidor): string {
    const identificador = servidor.siglaUnidade || servidor.nomeUnidade || 'OUTROS';
    return identificador.trim();
  }

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

export interface UnidadeContador {
  sigla: string;
  quantidade: number;
}
