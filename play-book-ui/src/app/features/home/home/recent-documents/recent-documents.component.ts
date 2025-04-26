import { Component } from '@angular/core';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import {DocCardComponent} from './components/doc-card/doc-card.component';
import {NgForOf} from '@angular/common';
import {Document} from '../../../../store/models/document.model';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {bootstrapPlus} from '@ng-icons/bootstrap-icons';
import {lucidePlus} from '@ng-icons/lucide';

@Component({
  selector: 'app-recent-documents',
  imports: [
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmBadgeDirective,
    DocCardComponent,
    NgForOf,
    HlmButtonDirective,
    NgIcon
  ],
  providers: [
    provideIcons({bootstrapPlus, lucidePlus})
  ],

  templateUrl: './recent-documents.component.html',
  styleUrl: './recent-documents.component.css'
})
export class RecentDocumentsComponent {
  docs: Document[] = [
    {
      id: '1',
      title: 'Example doc',
      description: 'This is a test doc to verify placement. It demonstrates the new card design.',
      user: {
        initials: 'JD',
        name: 'John Doe',
        avatarColor: '#9333EA' // purple-600
      },
      tags: ['tag', 'tag'],
      lastUpdated: '1 day ago',
      createdAt: '2025-04-22T14:30:00Z'
    },
    {
      id: '2',
      title: 'Product roadmap',
      description: 'Q3 product development timeline with feature priorities and release dates.',
      user: {
        initials: 'AM',
        name: 'Alice Miller',
        avatarColor: '#2563EB' // blue-600
      },
      tags: ['roadmap', 'planning'],
      lastUpdated: '3 days ago',
      createdAt: '2025-04-20T09:15:00Z'
    },
    {
      id: '3',
      title: 'Marketing campaign',
      description: 'Summer promotion strategy with target audiences and distribution channels.',
      user: {
        initials: 'RB',
        name: 'Robert Brown',
        avatarColor: '#16A34A' // green-600
      },
      tags: ['marketing', 'campaign'],
      lastUpdated: '5 days ago',
      createdAt: '2025-04-18T11:45:00Z'
    },
    {
      id: '4',
      title: 'Financial report',
      description: 'Monthly revenue analysis with expense breakdown and profit margins.',
      user: {
        initials: 'TS',
        name: 'Taylor Smith',
        avatarColor: '#CA8A04' // yellow-600
      },
      tags: ['finance', 'report'],
      lastUpdated: '1 week ago',
      createdAt: '2025-04-16T16:20:00Z'
    },
    {
      id: '5',
      title: 'Team meeting notes',
      description: 'Summary of weekly team meeting with action items and assigned tasks.',
      user: {
        initials: 'LJ',
        name: 'Lisa Johnson',
        avatarColor: '#DC2626' // red-600
      },
      tags: ['meeting', 'notes'],
      lastUpdated: '2 weeks ago',
      createdAt: '2025-04-09T10:00:00Z'
    }
  ]

}
