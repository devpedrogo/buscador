import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { UnidadeService } from '../../service/unidade-service';
import { Unidade } from '../../model/unidade';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServidorService } from '../../service/servidor-service';
import { Servidor } from '../../model/servidor';
import { LocalizadorModal } from '../localizador-modal/localizador-modal';

@Component({
  imports: [CommonModule, FormsModule, LocalizadorModal],
  selector: 'app-localizador-search',
  styleUrl: './localizador-search.css',
  templateUrl: './localizador-search.html',
})
export class LocalizadorSearch implements OnInit {

  private unidadeService = inject(UnidadeService);
  private servidorService = inject(ServidorService);

  // --- Form State ---
  nomeBusca = signal<string>('');
  unidadeSelecionada = signal<string>('Todo o Tribunal');

  // --- Data Signals ---
  unidades = signal<Unidade[]>([]);
  servidoresEncontrados = signal<Servidor[]>([]);

  // --- UI Signals ---
  isModalAberto = signal<boolean>(false);
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
        this.servidoresEncontrados.set(dados);
        this.isLoading.set(false);
        this.isModalAberto.set(true);
      },
      error: (err) => {
        console.error('Erro na busca de servidores:', err);
        this.servidoresEncontrados.set([]);
        this.isLoading.set(false);
        this.isModalAberto.set(true);
      }
    });
  }

  fecharModal(): void {
    this.isModalAberto.set(false);
  }
}
