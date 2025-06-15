import {Component, computed, input} from '@angular/core';
import {NgIcon, provideIcons} from "@ng-icons/core";
import {Space} from '../../../../../../store/models/Space.model';
import {Document} from '../../../../../../store/models/document.model';
import {NgForOf, NgIf} from '@angular/common';
import {BrnSeparatorComponent} from '@spartan-ng/brain/separator';
import {HlmSeparatorDirective} from '@spartan-ng/ui-separator-helm';
import {lucidePlus, lucideX} from '@ng-icons/lucide';
import {featherMoreVertical} from '@ng-icons/feather-icons';
import {
  heroAcademicCap,
  heroBanknotes, heroBeaker, heroBookOpen, heroBriefcase, heroCodeBracket,
  heroComputerDesktop, heroDocumentText,
  heroGlobeAlt, heroHeart, heroLightBulb,
  heroLockClosed,
  heroPlus, heroRocketLaunch,
  heroScale, heroShieldCheck, heroUserGroup,
  heroUserPlus,
  heroXMark
} from '@ng-icons/heroicons/outline';
import {HlmCardContentDirective} from '@spartan-ng/ui-card-helm';

@Component({
  selector: 'app-space-card',
  imports: [
    NgIcon,
    NgForOf,
    NgIf,
    BrnSeparatorComponent,
    HlmSeparatorDirective,
    HlmCardContentDirective
  ],
  providers: [
    provideIcons({
      lucidePlus,
      featherMoreVertical,
      heroPlus,
      heroXMark,
      heroUserPlus,
      heroGlobeAlt,
      heroLockClosed,
      heroScale,
      heroComputerDesktop,
      heroBanknotes,
      heroHeart,
      heroCodeBracket,
      heroBookOpen,
      heroBeaker,
      heroBriefcase,
      heroAcademicCap,
      heroRocketLaunch,
      heroShieldCheck,
      heroUserGroup,
      heroDocumentText,
      heroLightBulb,
      lucideX
    })
  ],
  templateUrl: './space-card.component.html',
  standalone: true,
  styleUrl: './space-card.component.css'
})
export class SpaceCardComponent {
  spaceSignal = input<Space>();
  space = computed(() => this.spaceSignal());
  icons: string[] = [

    'heroBookOpen',

    'heroLightBulb',

    'heroBeaker',

    'heroBriefcase',

    'heroAcademicCap',

    'heroRocketLaunch',

    'heroShieldCheck',

    'heroUserGroup',

    'heroDocumentText',

    'heroComputerDesktop',

    'heroScale',

    'heroBanknotes',

    'heroHeart',

    'heroCodeBracket'

  ];

  getInitials(firstName: string | undefined, lastName: string | undefined): string {
    if (!firstName && !lastName) return '?';

    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

    return firstInitial + lastInitial || firstInitial;
  }

  /**
   * Generates a consistent color based on user ID that will contrast well with white text
   */
  getAvatarColor(userId: string | undefined): string {
    // If no user ID is provided, use a default color
    if (!userId) return '#6366F1'; // Indigo color

    // Generate a hash from the userId for consistency
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to a positive number
    hash = Math.abs(hash);

    // List of background colors that contrast well with white text (all are dark/saturated enough)
    const contrastColors = [
      '#3B82F6', // Blue
      '#6366F1', // Indigo
      '#8B5CF6', // Violet
      '#D946EF', // Fuchsia
      '#EC4899', // Pink
      '#EF4444', // Red
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#14B8A6', // Teal
      '#0EA5E9', // Sky blue
      '#6D28D9', // Purple
      '#7C3AED', // Violet
      '#BE185D', // Rose
      '#059669', // Green
      '#2563EB', // Blue
      '#4F46E5', // Indigo
      '#7E22CE', // Purple
      '#0891B2', // Cyan
      '#B91C1C', // Red
      '#0D9488'  // Teal
    ];

    // Use the hash to pick a color from our list
    return contrastColors[hash % contrastColors.length];
  }
}

