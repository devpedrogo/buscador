import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { UnidadeService } from '../../service/unidade-service';
import { Unidade } from '../../model/unidade';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServidorService } from '../../service/servidor-service';
import { Servidor } from '../../model/servidor';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalizadorModal } from '../localizador-modal/localizador-modal';

@Component({
  imports: [CommonModule, FormsModule, MatDialogModule],
  selector: 'app-localizador-search',
  styleUrl: './localizador-search.css',
  templateUrl: './localizador-search.html',
})
export class LocalizadorSearch implements OnInit {

  private unidadeService = inject(UnidadeService);
  private servidorService = inject(ServidorService);
  private dialog = inject(MatDialog);

  nomeBusca = signal<string>('');
  unidadeSelecionada = signal<string>('Todo o Tribunal');

  unidades = signal<Unidade[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.carregarUnidades();
  }

  carregarUnidades(): void {
    this.unidadeService.findAll().subscribe({
      next: (dados) => this.unidades.set(dados),
      error: (err) => console.error('Erro ao carregar unidades:', err)
    });
  }

  onSubmit(): void {
    this.isLoading.set(true);

    this.servidorService.findServidores(this.nomeBusca(), this.unidadeSelecionada()).subscribe({
      next: (dados) => {
        this.isLoading.set(false);
        this.abrirModalResultados(dados);
      },
      error: (err) => {
        console.error('Erro na busca de servidores:', err);
        this.isLoading.set(false);
        this.abrirModalResultados([]);
      }
    });
  }

  private abrirModalResultados(servidores: Servidor[]): void {
    this.dialog.open(LocalizadorModal, {
      data: servidores,
      width: '90%',         // Ocupa 100% da largura disponível em dispositivos móveis
      maxWidth: '520px',
      panelClass: 'custom-localizador-dialog'
    });
  }
}
