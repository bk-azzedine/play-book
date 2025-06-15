import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpService} from '../../../shared/services/http.service';
import {Document} from '../../../store/models/document.model';
import {Company} from '../../../store/models/company.model';
import {DocumentRequest} from '../../requests/document.request';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  httpService = inject(HttpService);

  loadRecentDocs(organization: string, user: string): Observable<Document[]> {
    return this.httpService.get<Document[]>(`doc/organization/${organization}/user/${user}`, null).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Invalid server response');
      })
    );
  }
  loadAllDocuments(organization: string, user: string): Observable<Document[]> {
    return this.httpService.get<Document[]>(`doc/all/organization/${organization}/user/${user}`, null).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Invalid server response');
      })
    );
  }
  loadDraftDocuments(organization: string, user: string): Observable<Document[]> {
    return this.httpService.get<Document[]>(`doc/draft/organization/${organization}/user/${user}`, null).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Invalid server response');
      })
    );
  }

  loadFavoriteDocuments(organization: string, user: string): Observable<Document[]> {
    return this.httpService.get<Document[]>(`doc/favorite/organization/${organization}/user/${user}`, null).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Invalid server response');
      })
    );
  }

  loadOneDocument(docId: string): Observable<Document> {
    return this.httpService.get<Document>(`doc/${docId}`, null).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Invalid server response');
      })
    );
  }

  saveDocument(document: DocumentRequest): Observable<Document> {
    return this.httpService.post<any>("doc/", document).pipe(
      map(data => {
        if (data && data.body) {
          const responseDoc:Document = {
            id: data?.body.id,
            title: data?.body.title,
            description: data?.body.description,
            space: data?.body.space,
            organization: data?.body.organization,
            authors:data?.body.authors,
            content: data?.body.content,
            draft: data?.body.draft,
            favorite: data?.body.favorite,
            tags: data?.body.tags,
            lastUpdated: data?.body.lastUpdated,
            createdAt: data?.body.createdAt
          };
          return responseDoc;
        } else {
          throw new Error('Invalid server response');
        }
      })
    );
  }

  loadSpaceDocuments( space: string): Observable<Document[]> {
    return this.httpService.get<Document[]>(`doc/space/${space}`, null).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Invalid server response');
      })
    );
  }
}
