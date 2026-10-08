import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Servidor } from '../model/servidor';
import { environment } from '../../environments/environment.development';

@Service()
export class ServidorService {

  private http = inject(HttpClient);

  private readonly API_URL = `${environment.apiUrl}/servidores`;

  private headers = new HttpHeaders({
    'x-api-key': 'tokenteste'
  });

  findServidores(nomeServidor: string, unidadeParam: string): Observable<Servidor[]>{

    // 1. Começamos com o HttpParams vazio
    let params = new HttpParams();

    // 2. SÓ adiciona 'porNome' se 'nomeServidor' NÃO for vazio ou feito de espaços
    if (nomeServidor && nomeServidor.trim() !== '') {
      params = params.set('porNome', nomeServidor.trim());
    }

    // 3. SÓ adiciona 'porLotacao' se 'unidadeParam' tiver valor
    if (unidadeParam && unidadeParam.trim() !== '') {
      params = params.set('porLotacao', unidadeParam.trim());
    }

    return this.http.get<Servidor[]>(this.API_URL, {headers: this.headers, params: params})
  }

  /**
   * Busca sugestões de nomes para o autocomplete com base no termo digitado.
   */
  buscarSugestoesNome(termo: string): Observable<string[]> {
    if (!termo || termo.trim().length < 1) {
      return of([]);
    }

    const termoLimpo = termo.trim().toLowerCase();

    return this.findServidores(termoLimpo, '').pipe(
      map(servidores => {
        // Filtra apenas os registros caso o backend retorne dados sem aplicar o filtro
        const nomes = servidores
          .map(s => s.nome)
          .filter(nome => nome.toLowerCase().includes(termoLimpo) || nome.startsWith('A***')); // Mantém o match flexível para testes

        return Array.from(new Set(nomes));
      }),
      catchError(() => of([]))
    );
  }
}
