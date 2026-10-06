import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Unidade } from '../model/unidade';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Service()
export class UnidadeService {

  private http = inject(HttpClient);

  private readonly API_URL = `${environment.apiUrl}/unidades`;;

  private headers = new HttpHeaders({
    'x-api-key': 'tokenteste' // Subclua pelo nome do header e o valor correto
  });

  findAll(): Observable<Unidade[]> {
    return this.http.get<Unidade[]>(this.API_URL, { headers: this.headers });
  }

}
