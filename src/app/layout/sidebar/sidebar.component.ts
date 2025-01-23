import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, AfterViewInit {
  private menuLinks: NodeListOf<HTMLAnchorElement> | null = null;
  private collapseBtn: HTMLElement | null = null;
  private sidebar: HTMLElement | null = null;
  private collapsedClass = 'sidebar--collapsed';

  menu = [
    {
      section: true,
      item: "Bank"
    },
    {
      section: false,
      item: "Transactions",
      href: "#",
      svg: "assets/svgs/transaction.svg"
    },
    {
      section: false,
      item: "Transaction Types",
      href: "#",
      svg: "assets/svgs/transaction-type.svg"
    },
    {
      section: false,
      item: "Accounts",
      href: "#",
      svg: "assets/svgs/account.svg"
    },
    {
      section: false,
      item: "Customers",
      href: "#",
      svg: "assets/svgs/customer.svg"
    },
    {
      section: true,
      item: "Auth"
    },
    {
      section: false,
      item: "Users",
      href: "#",
      svg: "assets/svgs/user.svg"
    }
  ];

  constructor(private renderer: Renderer2, private el: ElementRef, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.collapseBtn = this.el.nativeElement.querySelector('.sidebar__content__menu__button-collapse');
    this.sidebar = this.el.nativeElement.querySelector('.sidebar');
  }

  ngAfterViewInit(): void {
    this.menuLinks = this.el.nativeElement.querySelectorAll('.sidebar__content__menu a'); 

    if (this.menuLinks?.length) {
      this.menuLinks.forEach(link => {
        this.renderer.listen(link, 'mouseenter', () => {
          if (
            this.sidebar?.classList.contains(this.collapsedClass) &&
            window.matchMedia("(min-width: 768px)").matches
          ) {
            const tooltip = link.querySelector("span")?.textContent || '';
            this.renderer.setAttribute(link, 'title', tooltip);
          } else {
            this.renderer.removeAttribute(link, 'title');
          }
        });
      });
    }
  }

  toggleMenu(): void {
    if (!this.collapseBtn) {
      return;
    }

    if (this.sidebar?.classList.contains(this.collapsedClass)) {
      this.renderer.removeClass(this.sidebar, this.collapsedClass);
    } else {
      this.renderer.addClass(this.sidebar, this.collapsedClass);
    }

    const ariaExpanded = this.collapseBtn.getAttribute('aria-expanded') === 'true';
    const ariaLabel = this.collapseBtn.getAttribute('aria-label');

    this.renderer.setAttribute(this.collapseBtn, 'aria-expanded', String(!ariaExpanded));
    this.renderer.setAttribute(this.collapseBtn, 'aria-label', ariaLabel === 'collapse menu' ? 'expand menu' : 'collapse menu');
    this.cdr.detectChanges()
  }

}