import { Component, computed, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { UnidadeService } from '../../service/unidade-service';
import { Unidade } from '../../model/unidade';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServidorService } from '../../service/servidor-service';
import { Servidor } from '../../model/servidor';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalizadorModal } from '../localizador-modal/localizador-modal';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  selector: 'app-localizador-search',
  styleUrl: './localizador-search.css',
  templateUrl: './localizador-search.html',
})
export class LocalizadorSearch implements OnInit {

  private unidadeService = inject(UnidadeService);
  private servidorService = inject(ServidorService);
  private dialog = inject(MatDialog);

  // --- Form Signals ---
  nomeBusca = signal<string>('');
  unidadeSelecionada = signal<string>('Todo o Tribunal');
  unidadeTextoInput = signal<string>('Todo o Tribunal'); // Texto visível no input

  // --- Data Signals ---
  unidades = signal<Unidade[]>([]);
  isLoading = signal<boolean>(false);

  // Computed Signal: Filtra as unidades em tempo real conforme o usuário digita
  unidadesFiltradas = computed(() => {
    const termo = this.unidadeTextoInput().toLowerCase().trim();
    if (!termo || termo === 'todo o tribunal') {
      return this.unidades();
    }
    return this.unidades().filter(u =>
      u.descricaoUnidade.toLowerCase().includes(termo) ||
      u.siglaUnidade.toLowerCase().includes(termo)
    );
  });

  ngOnInit(): void {
    this.carregarUnidades();
  }

  carregarUnidades(): void {

    // Se já tivermos unidades carregadas, não refazemos a chamada
    if (this.unidades().length > 0) return;

    this.unidadeService.findAll().subscribe({
      next: (dados) => this.unidades.set(dados),
      error: (err) => console.error('Erro ao carregar unidades:', err)
    });
  }

  // Disparado no (focus) e (click) do <select>
  onFocusUnidades(): void {
    if (this.unidades().length === 0) {
      this.carregarUnidades();
    }

    // Limpa o texto visível para o usuário começar a digitar sem precisar apagar
    this.unidadeTextoInput.set('');
  }

  // Método disparado quando o input perde o foco sem que o usuário tenha selecionado uma nova opção
  onBlurUnidades(): void {
    // Aguarda 150ms para permitir que o clique na opção do autocomplete (optionSelected) seja processado
    setTimeout(() => {
      // Se após esse tempo o input continuar vazio (usuário clicou fora sem escolher nada)
      if (!this.unidadeTextoInput().trim()) {
        const atual = this.unidadeSelecionada();

        if (atual === 'Todo o Tribunal') {
          this.unidadeTextoInput.set('Todo o Tribunal');
        } else {
          const unidadeEncontrada = this.unidades().find(u => u.siglaUnidade === atual);
          if (unidadeEncontrada) {
            this.unidadeTextoInput.set(`${unidadeEncontrada.siglaUnidade} - ${unidadeEncontrada.descricaoUnidade}`);
          } else {
            this.unidadeTextoInput.set(atual);
          }
        }
      }
    }, 150);
  }

  // Atualiza quando o usuário clica em uma opção do autocomplete
  onUnidadeSelecionada(event: MatAutocompleteSelectedEvent): void {

    const valor = event.option.value;

    if (typeof valor === 'string') {
      this.unidadeTextoInput.set(valor);
      this.unidadeSelecionada.set(valor);
    } else {
      const unidade = valor as Unidade;
      this.unidadeTextoInput.set(`${unidade.siglaUnidade} - ${unidade.descricaoUnidade}`);
      this.unidadeSelecionada.set(`${unidade.siglaUnidade} - ${unidade.descricaoUnidade}`);
    }
  }

  // Permite limpar o campo para redefinir para 'Todo o Tribunal'
  onInputUnidadeChange(valor: string): void {
    this.unidadeTextoInput.set(valor);
    if (!valor.trim()) {
      this.unidadeSelecionada.set('Todo o Tribunal');
    }
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
