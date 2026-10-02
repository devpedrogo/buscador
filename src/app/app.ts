import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UnidadeService } from './service/unidade-service';
import { Unidade } from './model/unidade';
import { response } from 'express';
import { error } from 'console';
import { ServidorService } from './service/servidor-service';
import { Servidor } from './model/servidor';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit{

  private unidadeService = inject(UnidadeService)
  private servidorService = inject(ServidorService)

  unidadesSignal = signal<Unidade[]>([])
  servidoresSignal = signal<Servidor[]>([])

  // Sinais que controlam os inputs da tela (Filtros)
  nomeFiltroSignal = signal<string>('');
  lotacaoSelecionadaSignal = signal<string>('Todo o Tribunal');

  ngOnInit(): void {
    console.log("olá, mundo!");
    this.loadUnidades();
    this.buscar();
  }

  loadUnidades(){
    this.unidadeService.findAll().subscribe({
      next: (response) => {
        this.unidadesSignal.set(response);
        console.log(this.unidadesSignal());
      },
      error: (error) => {
        console.log('Erro ao buscar posts:', error);
      },
    })
  }

  buscar() {
    const nome = this.nomeFiltroSignal();
    const lotacao = this.lotacaoSelecionadaSignal();

    this.servidorService.findServidores(nome, lotacao).subscribe({
      next: (resultado) => {
        // Alimenta o sinal com o array de servidores que veio do backend
        this.servidoresSignal.set(resultado);
        console.log(this.servidoresSignal())
      },
      error: (err) => console.error('Erro ao buscar servidores:', err)
    });
  }

  // ➔ Método que faltava: Atualiza o sinal conforme o usuário digita o nome
  aoDigitarNome(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.nomeFiltroSignal.set(input.value);
  }

  // ➔ Método que faltava: Atualiza a lotação e já dispara a busca automaticamente
  aoMudarLotacao(evento: Event) {
    const select = evento.target as HTMLSelectElement;
    this.lotacaoSelecionadaSignal.set(select.value);
    this.buscar(); // Executa a busca na hora que muda o select
  }

}
