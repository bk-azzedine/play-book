import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {NgForOf, NgIf} from '@angular/common';
import {lucideChevronLeft, lucideChevronRight} from '@ng-icons/lucide';

@Component({
  selector: 'app-carousel',
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideChevronLeft
    })
  ],
  imports: [
    NgIcon,
    NgIf,
    NgForOf
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  @Input() itemsPerView = 4
  @Input() gap = 20
  @Input() showDots = false
  @Input() autoPlay = false
  @Input() autoPlayInterval = 3000
  @Input() responsive: { [key: string]: number } = {
    "640": 1,
    "768": 2,
    "1024": 3,
    "1280": 4,
  }

  @Output() slideChange = new EventEmitter<number>()

  @ViewChild("carouselContainer", { static: false }) carouselContainer!: ElementRef

  currentIndex = 0
  currentPage = 0
  translateX = 0
  itemWidth = 0
  totalItems = 0
  currentItemsPerView = 4

  private autoPlayTimer?: number
  private resizeObserver?: ResizeObserver

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.currentItemsPerView)
  }

  get maxIndex(): number {
    return Math.max(0, this.totalItems - this.currentItemsPerView)
  }

  get showPrevious(): boolean {
    return this.totalItems > this.currentItemsPerView
  }

  get showNext(): boolean {
    return this.totalItems > this.currentItemsPerView
  }

  get dots(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i)
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupCarousel()
      this.setupResponsive()
      this.setupAutoPlay()
    }, 100)
  }

  ngOnDestroy(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer)
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }

  private setupCarousel(): void {
    if (!this.carouselContainer) return

    const container = this.carouselContainer.nativeElement
    this.totalItems = container.children.length
    this.updateItemsPerView()
    this.calculateDimensions()
  }

  private setupResponsive(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateItemsPerView()
      this.calculateDimensions()
      this.updatePosition()
    })

    if (this.carouselContainer?.nativeElement?.parentElement) {
      this.resizeObserver.observe(this.carouselContainer.nativeElement.parentElement)
    }
  }

  private updateItemsPerView(): void {
    const width = window.innerWidth

    const breakpoints = Object.keys(this.responsive)
      .map((bp) => Number.parseInt(bp))
      .sort((a, b) => b - a)

    for (const breakpoint of breakpoints) {
      if (width >= breakpoint) {
        this.currentItemsPerView = this.responsive[breakpoint.toString()]
        break
      }
    }

    if (!this.currentItemsPerView) {
      this.currentItemsPerView = this.itemsPerView
    }
  }

  private calculateDimensions(): void {
    if (!this.carouselContainer) return

    const container = this.carouselContainer.nativeElement
    const containerWidth = container.parentElement?.offsetWidth || 0

    // Account for button space (96px total - 48px on each side)
    const availableWidth = containerWidth - 96
    this.itemWidth = (availableWidth - this.gap * (this.currentItemsPerView - 1)) / this.currentItemsPerView

    // Set width for each item
    Array.from(container.children).forEach((child: any, index) => {
      child.style.width = `${this.itemWidth}px`
      child.style.marginRight = index < container.children.length - 1 ? `${this.gap}px` : "0"
      child.style.flexShrink = "0"
    })
  }

  private updatePosition(): void {
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex)
    this.translateX = -(this.currentIndex * (this.itemWidth + this.gap))
    this.currentPage = Math.floor(this.currentIndex / this.currentItemsPerView)
    this.slideChange.emit(this.currentIndex)
  }

  private setupAutoPlay(): void {
    if (!this.autoPlay) return

    this.autoPlayTimer = window.setInterval(() => {
      if (this.currentIndex >= this.maxIndex) {
        this.currentIndex = 0
      } else {
        this.currentIndex++
      }
      this.updatePosition()
    }, this.autoPlayInterval)
  }

  next(): void {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex = Math.min(this.currentIndex + this.currentItemsPerView, this.maxIndex)
      this.updatePosition()
    }
  }

  previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex = Math.max(this.currentIndex - this.currentItemsPerView, 0)
      this.updatePosition()
    }
  }

  goToPage(pageIndex: number): void {
    this.currentIndex = pageIndex * this.currentItemsPerView
    this.updatePosition()
  }

  goToSlide(index: number): void {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex))
    this.updatePosition()
  }
}
