import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Unidade } from '../model/unidade';
import { Observable } from 'rxjs';

@Service()
export class UnidadeService {

  private http = inject(HttpClient);

  private headers = new HttpHeaders({
    'x-api-key': 'tokenteste' // Subclua pelo nome do header e o valor correto
  });

  findAll(): Observable<Unidade[]> {
    return this.http.get<Unidade[]>("http://localhost:8085/v1/unidades", { headers: this.headers });
  }
}
