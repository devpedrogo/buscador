import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
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
}
