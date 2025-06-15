import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf} from '@angular/common';

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
  time: string;
}

@Component({
  selector: 'app-chat-window',
  imports: [
    FormsModule,
    NgClass,
    NgForOf
  ],
  templateUrl: './chat-window.component.html',
  standalone: true,
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit{
  @ViewChild('chatButton', { static: false }) chatButton!: ElementRef<HTMLElement>;
  @ViewChild('chatSlider', { static: false }) chatSlider!: ElementRef<HTMLElement>;
  @ViewChild('chatOverlay', { static: false }) chatOverlay!: ElementRef<HTMLElement>;
  @ViewChild('closeButton', { static: false }) closeButton!: ElementRef<HTMLElement>;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('sendButton', { static: false }) sendButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('chatMessages', { static: false }) chatMessages!: ElementRef<HTMLElement>;
  @ViewChild('typingIndicator', { static: false }) typingIndicator!: ElementRef<HTMLElement>;

  // New: Array to hold messages
  messages: ChatMessage[] = [];
  userMessageInput: string = ''; // New: For two-way binding with textarea

  ngOnInit() {
    // Add initial bot messages here
    this.messages.push(
      { type: 'bot', content: '👋 Hi there! Welcome to I dont have a name yet. How can I help you today?', time: 'Just now' },
      { type: 'bot', content: 'I can help you with questions regarding all documents that you have', time: 'Just now' }
    );
  }

  ngAfterViewInit() { // Use AfterViewInit for DOM element access
    // Initialize event listeners after the view has been initialized and child components are ready
    if (this.chatButton && this.chatOverlay && this.closeButton && this.messageInput && this.sendButton && this.chatMessages && this.typingIndicator) {
      this.initializeEventListeners();
      if (this.sendButton?.nativeElement) {
        this.sendButton.nativeElement.disabled = true;
      }
      this.scrollToBottom(); // Scroll to initial messages
    } else {
      console.error("One or more view children are not initialized.");
      // You might want to add a retry mechanism or handle this more robustly
    }
  }

  private initializeEventListeners() {
    // Event listeners
    this.chatButton.nativeElement.addEventListener('click', () => this.openChat());
    this.chatOverlay.nativeElement.addEventListener('click', () => this.closeChat());
    this.closeButton.nativeElement.addEventListener('click', () => this.closeChat());
    this.sendButton.nativeElement.addEventListener('click', () => this.sendMessage());

    // Input handling
    // Use (input) and (keydown) events directly in the template for better Angular integration
    // this.messageInput.nativeElement.addEventListener('input', () => {
    //   this.autoResize();
    //   this.sendButton.nativeElement.disabled = !this.messageInput.nativeElement.value.trim();
    // });
    // this.messageInput.nativeElement.addEventListener('keydown', (e) => {
    //   if (e.key === 'Enter' && !e.shiftKey) {
    //     e.preventDefault();
    //     if (this.userMessageInput.trim()) { // Use userMessageInput here
    //       this.sendMessage();
    //     }
    //   }
    // });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.chatSlider.nativeElement.classList.contains('active')) {
        this.closeChat();
      }
    });

    // Prevent chat from closing when clicking inside
    this.chatSlider.nativeElement.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Handle input change directly from the template
  onMessageInputChange() {
    this.autoResize();
    this.sendButton.nativeElement.disabled = !this.userMessageInput.trim();
  }

  // Handle keydown for Enter
  onMessageInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.userMessageInput.trim()) {
        this.sendMessage();
      }
    }
  }

  // Open chat
  openChat() {
    this.chatButton.nativeElement.classList.add('active');
    this.chatSlider.nativeElement.classList.add('active');
    this.chatOverlay.nativeElement.classList.add('active');

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      this.messageInput.nativeElement.focus();
      this.scrollToBottom();
    }, 300);
  }

  // Close chat
  closeChat() {
    this.chatButton.nativeElement.classList.remove('active');
    this.chatSlider.nativeElement.classList.remove('active');
    this.chatOverlay.nativeElement.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Auto-resize textarea
  autoResize() {
    const input = this.messageInput.nativeElement;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  // Scroll to bottom
  scrollToBottom() {
    // Ensure this runs after Angular has rendered new messages
    setTimeout(() => {
      if (this.chatMessages && this.chatMessages.nativeElement) {
        const messages = this.chatMessages.nativeElement;
        messages.scrollTop = messages.scrollHeight;
      }
    }, 0); // Use a small timeout to allow Angular's change detection to complete
  }

  // Get current time
  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Show typing indicator
  showTyping() {
    this.typingIndicator.nativeElement.classList.add('active');
    this.scrollToBottom();
  }

  // Hide typing indicator
  hideTyping() {
    this.typingIndicator.nativeElement.classList.remove('active');
  }

  // Send message
  sendMessage() {
    const messageContent = this.userMessageInput.trim();
    if (messageContent) {
      // Add user message to the array
      this.messages.push({
        type: 'user',
        content: messageContent,
        time: this.getCurrentTime()
      });

      // Clear input and reset height
      this.userMessageInput = '';
      this.messageInput.nativeElement.style.height = 'auto';
      this.sendButton.nativeElement.disabled = true;

      this.scrollToBottom();

      // Show typing indicator
      setTimeout(() => {
        this.showTyping();
      }, 500);

      // Simulate bot response
      setTimeout(() => {
        this.hideTyping();

        // Add bot message to the array
        this.messages.push({
          type: 'bot',
          content: `Thanks for reaching out! I've received your message about "${messageContent.substring(0, 30)}${messageContent.length > 30 ? '...' : ''}". A member of our PlayBook support team will respond to you shortly.`,
          time: this.getCurrentTime()
        });

        this.scrollToBottom();
      }, 2000);
    }
  }
}
