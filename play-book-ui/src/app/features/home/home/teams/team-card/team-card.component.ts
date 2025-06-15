import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {Team} from '../../../../../store/models/team.model';

@Component({
  selector: 'app-team-card',
  imports: [
    NgClass,
    NgIf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.css'
})
export class TeamCardComponent {
  @Input() team!: Team;
  @Input() userId: string | undefined;
  @Output() teamSelected = new EventEmitter<string>();
  @Output() viewTeam = new EventEmitter<string>();
  userRole: string  = 'member';


  getUserRole(): string {
   const teamMember = this.team.members?.find(member => member.user.userId === this.userId);
    if (teamMember) {
      return teamMember.role;
    }
    return 'member'; // Default role if not found
  }

  getRoleBadge(role: string): string {
    const colors: { [key: string]: string } = {
      owner: 'badge-warning',
      admin: 'badge-info',
      member: 'badge-light'
    };
    return colors[role] || colors['member'];
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'OWNER':
        return 'crown';
      case 'ADMIN':
        return 'settings';
      default:
        return 'users';
    }
  }

  getRoleIconClass(role: string): string {
    switch (role) {
      case 'OWNER':
        return 'text-warning';
      case 'ADMIN':
        return 'text-info';
      default:
        return 'text-muted';
    }
  }

  onCardClick(): void {
    this.teamSelected.emit(this.team.teamId);
  }

  onViewTeamClick(event: Event): void {
    event.stopPropagation();
    this.viewTeam.emit(this.team.teamId);
  }

   getInitials(str: string) {
    if (!str || typeof str !== 'string') return '';

    return str.trim()
      .split(/\s+/) // Split on any whitespace
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
}
