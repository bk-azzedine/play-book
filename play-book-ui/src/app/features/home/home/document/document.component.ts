import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Document} from '../../../../store/models/document.model';
import EditorJS, {OutputData} from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Warning from '@editorjs/warning';
import InlineCode from '@editorjs/inline-code';
// @ts-ignore
import Marker from '@editorjs/marker';
import {
  HlmBreadcrumbDirective,
  HlmBreadcrumbItemDirective,
  HlmBreadcrumbLinkDirective,
  HlmBreadcrumbListDirective,
  HlmBreadcrumbPageDirective,
  HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import {HlmIconDirective} from '@spartan-ng/ui-icon-helm';
import {BrnMenuTriggerDirective} from '@spartan-ng/brain/menu';
import {HlmMenuComponent} from '@spartan-ng/ui-menu-helm';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {
  bootstrapChat,
  bootstrapClipboard,
  bootstrapClock,
  bootstrapEye,
  bootstrapCloud,
  bootstrapPlus
} from '@ng-icons/bootstrap-icons';
import {lucideChevronDown, lucideDatabase, lucideList, lucidePlus, lucideSquarePen, lucideX} from '@ng-icons/lucide'; // Added lucideX
import {LowerCasePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {HlmSeparatorDirective} from '@spartan-ng/ui-separator-helm';
import {BrnSeparatorComponent} from '@spartan-ng/brain/separator';
import {FormsModule} from '@angular/forms';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {Store} from '@ngrx/store';
import {User} from '../../../../store/models/user.model';
import {Subject, Subscription, takeUntil} from 'rxjs';
import {selectUser} from '../../../../store/selectors/auth.selector';
import {selectSelectedCompany, selectUserSpaces} from '../../../../store/selectors/company.selector';
import {Space} from '../../../../store/models/Space.model';
import {DocumentRequest} from '../../../../core/requests/document.request';
import {HlmBadgeDirective} from '@spartan-ng/ui-badge-helm';
import {ReplacePipe} from '../../../../core/pipes/header.pipe';
import {

  loadOneDocument,
  saveDocument, saveDocumentFailure,
  saveDocumentSuccess
} from '../../../../store/actions/document.actions';
import {heroEye, heroHeart, heroPencilSquare} from '@ng-icons/heroicons/outline';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {selectDocumentById} from '../../../../store/selectors/document.selector';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';
import {Actions, ofType} from '@ngrx/effects';
import {toast} from 'ngx-sonner';
import {featherMoreVertical} from '@ng-icons/feather-icons';
import {TeamMenuComponent} from '../nav/components/team-menu/team-menu.component';


@Component({
  selector: 'app-create-document',
  imports: [
    HlmBreadcrumbDirective,
    HlmBreadcrumbItemDirective,
    HlmBreadcrumbPageDirective,
    HlmBreadcrumbLinkDirective,
    HlmBreadcrumbListDirective,
    HlmBreadcrumbSeparatorComponent,
    HlmInputDirective,
    NgIcon,
    HlmButtonDirective,
    NgIf,
    HlmSeparatorDirective,
    BrnSeparatorComponent,
    FormsModule,
    BrnMenuTriggerDirective,
    NgForOf,
    HlmIconDirective,
    HlmMenuComponent,
    HlmBadgeDirective,
    NgClass,
    LowerCasePipe,
    ReplacePipe,
    HlmToasterComponent,
    HlmMenuComponent
  ],
  providers: [
    provideIcons({
      lucideList,
      lucidePlus,
      lucideChevronDown,
      bootstrapChat,
      bootstrapClipboard,
      bootstrapClock,
      bootstrapEye,
      bootstrapCloud,
      bootstrapPlus,
      lucideDatabase,
      lucideX,
      heroEye,
      lucideSquarePen,
      featherMoreVertical,
      heroHeart,
      heroPencilSquare
    })
  ],
  templateUrl: './document.component.html',
  standalone: true,
  styleUrl: './document.component.css'
})
export class DocumentComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  actions$ = inject(Actions);
  store = inject(Store);
  route = inject(ActivatedRoute);
  editorState! : boolean;
  private cdr = inject(ChangeDetectorRef);
  activeTab = 'metadata';
  editor!: EditorJS;
  spaces!: Space[];
  headers?: {header: string, level: number}[]
  selectedSpace: Space | null = null;
  documentEdit: DocumentRequest = {
    id:null,
    title: 'Untitled Document',
    description: '',
    space: '',
    organization: '',
    authors: [],
    draft: false,
    favorite: false,
    content: null,
    tags: [],
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  loadedDocument: Document | undefined;

  @ViewChild('titleInput') titleInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('tagsInputEl') tagsInputEl: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('descriptionInputEl') descriptionInputEl: ElementRef<HTMLTextAreaElement> | undefined;

  isEditing = false; // For document title
  docId! :string | null;
  currentUser?: User;
  private subscriptions = new Subscription();
  authors: Array<{id: string, name: string, initials: string, color: string}> = [];
  // --- Metadata Specific Properties ---
  isTagEditing = false; // Indicates if the tags input has focus and potentially unsaved changes
  isDescriptionEditing = false;
  tagsInputString: string = '';
  descriptionInputString: string = '';
  // --- End Metadata Specific Properties ---

  ngOnInit(): void {
      // Handle success actions
      this.actions$.pipe(
        ofType(saveDocumentSuccess),
        takeUntil(this.destroy$)
      ).subscribe(action => {
        toast.success('document has been created', {
          description: `${action.document.title} was successfully saved`
        });
      });

      // Handle error actions
      this.actions$.pipe(
        ofType(saveDocumentFailure),
        takeUntil(this.destroy$)
      ).subscribe(action => {
        toast.error('Failed to save document', {
          description: action.error?.message || 'An error occurred while saving the document'
        });
      });



    this.subscriptions.add(
      this.route.paramMap.pipe(
        take(1)
      ).subscribe(params => {
        this.docId = params.get('id');
        if (this.docId && this.docId !== 'new') {
          this.initializeForExistingDocument();
        } else {
          this.initializeForNewDocument();
        }
      })
    );
  }

  loadDocument(docId: string): void {
    this.store.dispatch(loadOneDocument({ documentId: docId }));
  }

  private initializeForNewDocument(): void {
    this.editorState = true;
    this.setupUserAndSpaces();
    this.descriptionInputString = this.documentEdit.description;
    this.initEditor(undefined);
  }

  private setupUserAndSpaces(): void {
    this.subscriptions.add(
      this.store.select(selectUser).subscribe(user => {
        if (user) {
          this.currentUser = user;
          if (user.userId) {
            this.documentEdit = {
              ...this.documentEdit,
              authors: [user.userId]
            };
          }
          this.initializeAuthors();
        }
      })
    );

    this.subscriptions.add(
      this.store.select(selectUserSpaces).subscribe(spaces => {
        this.spaces = spaces;
      })
    );

    this.subscriptions.add(
      this.store.select(selectSelectedCompany).subscribe(company => {
        if (company && company.organizationId) {
          this.documentEdit = {
            ...this.documentEdit,
            organization: company.organizationId
          };
        }
      })
    );
  }

  initializeAuthors(): void {
    if (this.currentUser) {
      const firstName = this.currentUser.firstName || '';
      const lastName = this.currentUser.lastName || '';
      const firstInitial = firstName.length > 0 ? firstName[0] : '';
      const lastInitial = lastName.length > 0 ? lastName[0] : '';
      const initials = `${firstInitial}${lastInitial}`;
      const safeInitials = initials.trim() ? initials.toUpperCase() : 'UN';
      const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : (this.currentUser.email || 'Unknown User');
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      this.authors = [{
        id: this.currentUser.userId || 'unknown',
        name: fullName,
        initials: safeInitials,
        color: randomColor
      }];
    } else {
      this.authors = [];
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.editor && typeof this.editor.destroy === 'function') {
      try {
        this.editor.destroy();
      } catch (e) {
        console.error("Error destroying EditorJS instance:", e);
      }
    }
  }

  setActiveTab(tab: string): void {
    if (this.activeTab === 'metadata' && tab !== 'metadata') {
      if (this.isTagEditing) {
        this.saveTags(); // Process any pending tags and set isTagEditing to false
      }
      if (this.isDescriptionEditing) {
        this.saveDescription(); // Process description and set isDescriptionEditing to false
      }
    }
    this.activeTab = tab;
  }

  initEditor(data: OutputData | undefined): void {
    // Destroy existing editor if it exists
    if (this.editor && typeof this.editor.destroy === 'function') {
      try {
        this.editor.destroy();
      } catch (e) {
        console.error("Error destroying EditorJS instance:", e);
      }
    }

    const editorTools: any = {
      header: { class: Header, inlineToolbar: ['marker', 'inlineCode'], config: { placeholder: 'Enter a heading', levels: [1, 2, 3, 4, 5, 6], defaultLevel: 3 }},
      list: { class: List, inlineToolbar: true },
      table: { class: Table, inlineToolbar: true },
      quote: { class: Quote, inlineToolbar: true },
      code: { class: CodeTool },
      delimiter: { class: Delimiter },
      warning: { class: Warning, inlineToolbar: true },
      inlineCode: { class: InlineCode },
      marker: { class: Marker, shortcut: 'CMD+SHIFT+M' },
    };

    this.editor = new EditorJS({
      holder: 'editorjs',
      autofocus: true,
      data: data,
      placeholder: 'Start writing your document...',
      tools: editorTools,
      readOnly: !this.editorState, // Set readOnly to opposite of editorState
      sanitizer: { p: true, b: true, a: true, span: { class: true, style: true }, mark: { class: true, style: true }},
      onChange: async (api, event) => {
        const events = Array.isArray(event) ? event : [event];

        for (const e of events) {
          const blockType = e?.detail?.target?.name;

          if (blockType === 'header') {
            const editorData = await api.saver.save();
            this.headers = editorData.blocks
              .filter(block => block.type === 'header')
              .map(block => ({
                header: block.data?.text || '',
                level: block.data?.level || 1
              }));
          }
        }
      }
    });
  }

  async saveEditorContent(): Promise<void> {
    if (!this.editor) {
      console.warn('Editor not initialized.');
      return;
    }
    if (!this.selectedSpace?.spaceId) {
      alert('Please select a space for the document.');
      return;
    }
    if (!this.documentEdit.organization) {
      alert('Organization ID is missing. Please ensure a company is selected.');
      return;
    }

    if (this.isTagEditing) {
      this.saveTags();
    }
    if (this.isDescriptionEditing) {
      this.saveDescription();
    }

    try {
      const outputData = await this.editor.save();
      const finalTitle = this.documentEdit.title.trim() === '' ? 'Untitled Document' : this.documentEdit.title.trim();

      const updatedDocument: DocumentRequest = {
        ...this.documentEdit,
        title: finalTitle,
        content: outputData,
        space: this.selectedSpace.spaceId,
        lastUpdated: new Date().toISOString(),
      };
      this.documentEdit = updatedDocument;

      this.store.dispatch(saveDocument({ document: updatedDocument }));
    } catch (error) {
      console.error('Saving document failed: ', error);
    }
  }

  startEditing(): void { // For document title
    this.isEditing = true;
    setTimeout(() => {
      this.titleInput?.nativeElement.focus();
      this.titleInput?.nativeElement.select();
      this.cdr.detectChanges();
    });
  }

  saveTitle(): void { // For document title
    this.isEditing = false;
    const newTitle = this.documentEdit.title.trim();
    this.documentEdit = {
      ...this.documentEdit,
      title: newTitle === '' ? 'Untitled Document' : newTitle,
      lastUpdated: new Date().toISOString()
    };
  }

  onKeyDown(event: KeyboardEvent): void { // For document title
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveTitle();
    } else if (event.key === 'Escape') {
      this.isEditing = false;
    }
  }

  selectSpace(space: Space): void {
    this.selectedSpace = space;
    this.documentEdit = {
      ...this.documentEdit,
      space: space.spaceId,
      lastUpdated: new Date().toISOString()
    };
    console.log('Space set in document:', this.documentEdit.space);
  }

  private addTagsFromInput(): void { // Renamed to private as it's an internal helper for saveTags
    const newTagsRaw = this.tagsInputString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    if (newTagsRaw.length > 0) {
      const currentTagsSet = new Set(this.documentEdit.tags);
      let changed = false;
      newTagsRaw.forEach(tag => {
        if (!currentTagsSet.has(tag)) {
          currentTagsSet.add(tag);
          changed = true;
        }
      });

      if (changed) {
        this.documentEdit = {
          ...this.documentEdit,
          tags: Array.from(currentTagsSet).sort(),
          lastUpdated: new Date().toISOString()
        };
      }
    }
    this.tagsInputString = '';
  }

  saveTags(): void { // Public method to be called externally or by event handlers
    this.addTagsFromInput();
    this.isTagEditing = false; // Mark editing as complete
  }

  addTagsOnBlur(): void {
    // Save any pending tags when the input loses focus, only if it was being edited.
    // This prevents saving if blur happens for other reasons when not actively editing tags.
    if (this.isTagEditing) {
      this.saveTags(); // This will call addTagsFromInput and set isTagEditing to false
    }
  }

  removeTag(tagToRemove: string): void {
    const originalTagsCount = this.documentEdit.tags.length;
    this.documentEdit = {
      ...this.documentEdit,
      tags: this.documentEdit.tags.filter(tag => tag !== tagToRemove)
    };
    if (this.documentEdit.tags.length !== originalTagsCount) {
      this.documentEdit = {
        ...this.documentEdit,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  handleTagsKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.saveTags(); // Use saveTags to process input and reset editing state
    } else if (event.key === 'Escape') {
      this.tagsInputString = '';
      this.isTagEditing = false; // Also mark editing as complete/cancelled
      // Optionally, blur the input if desired: this.tagsInputEl?.nativeElement.blur();
    } else if (event.key === 'Backspace' && this.tagsInputString === '' && this.documentEdit.tags.length > 0) {
      this.removeTag(this.documentEdit.tags[this.documentEdit.tags.length - 1]);
    }
  }

  startDescriptionEditing(): void {
    this.descriptionInputString = this.documentEdit.description;
    this.isDescriptionEditing = true;
    setTimeout(() => {
      this.descriptionInputEl?.nativeElement.focus();
      this.descriptionInputEl?.nativeElement.select();
      this.cdr.detectChanges();
    });
  }

  saveDescription(): void {
    const newDescription = this.descriptionInputString.trim();
    if (this.documentEdit.description !== newDescription) {
      this.documentEdit = {
        ...this.documentEdit,
        description: newDescription,
        lastUpdated: new Date().toISOString()
      };
    }
    this.isDescriptionEditing = false;
  }

  handleDescriptionKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.descriptionInputString = this.documentEdit.description;
      this.isDescriptionEditing = false;
    }
  }

  getHeadingNumber(index: number): string {
    return `${index + 1}.`;
  }

  editOrPreview(state: boolean): void {
    this.editorState = state;
    if (this.editor) {
      this.editor.readOnly.toggle(!state);
    }
  }

  private initializeForExistingDocument(): void {
    // Set editor state to read-only initially for existing document
    this.editorState = false;

    if (!this.docId) {
      console.error('Document ID is not defined');
      return;
    }

    // First load the document
    this.loadDocument(this.docId);

    // Setup basic user and spaces info
    this.setupUserAndSpaces();


    this.subscriptions.add(
      this.store.select(selectDocumentById(this.docId)).subscribe({
        next: (document) => {
          if (document) {
            this.loadedDocument = document;
            this.documentEdit = {
              id: document.id,
              title: document.title || 'Untitled Document',
              description: document.description || '',
              space: document.space || '',
              organization: document.organization || '',
              authors: this.getAuthorIds(document.authors)  || [],
              content: document.content,
              tags: document.tags || [],
              draft: document.draft ,
              favorite: document.favorite ,
              lastUpdated: document.lastUpdated || new Date().toISOString(),
              createdAt: document.createdAt || new Date().toISOString()
            };

            this.descriptionInputString = this.documentEdit.description;

            if (document.space && this.spaces) {
              const space = this.spaces.find(s => s.spaceId === document.space);
              if (space) this.selectedSpace = space;
            }

            this.initEditor(document.content as OutputData);
          } else {
            console.warn(`Document with ID ${this.docId} not found in store`);
          }
        },
        error: (err) => {
          console.error('Error loading document:', err);
        }
      })
    );
  }

  getAuthorIds(authors: User[]): string[] {
    return authors
      .map(author => author?.userId)
      .filter((id): id is string => id !== undefined && id !== null);
  }

  toggleFavorite(): void {
    this.documentEdit = {
      ...this.documentEdit,
      favorite: !this.documentEdit.favorite,
      lastUpdated: new Date().toISOString()
    };
    const message = this.documentEdit.favorite ? 'Document marked as favorite' : 'Document removed from favorites';
    toast.success(message);
  }

  toggleDraft(): void {
    this.documentEdit = {
      ...this.documentEdit,
      draft: !this.documentEdit.draft,
      lastUpdated: new Date().toISOString()
    };
    const message = this.documentEdit.draft ? 'Document marked as draft' : 'Document marked as published';
    toast.success(message);
  }

}
