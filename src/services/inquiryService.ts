import { CustomerInquiry } from '../types';

const STORAGE_KEY = 'rass_customer_inquiries';

class InquiryService {
  private inquiries: CustomerInquiry[] = [];
  private listeners: Array<(inquiries: CustomerInquiry[]) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.inquiries = JSON.parse(saved);
      } else {
        // Initial sample inquiry for immediate demo & testing
        this.inquiries = [
          {
            id: 'INQ-94821',
            name: 'Priyanka Sharma',
            email: 'priyanka.s@example.com',
            phone: '+91 98765 43210',
            subject: 'Custom Sizing for Basra Pearl Kada',
            message: 'Hello, I loved the Basra Pearl kada in size 2.4. Could you let me know if custom sizing is possible for smaller wrists (approx 54mm)?',
            createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
            status: 'unread',
            source: 'about_modal'
          }
        ];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('[InquiryService] Failed to load inquiries from storage:', e);
      this.inquiries = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inquiries));
      this.notify();
    } catch (e) {
      console.warn('[InquiryService] Failed to save inquiries to storage:', e);
    }
  }

  public getInquiries(): CustomerInquiry[] {
    return [...this.inquiries];
  }

  public getUnreadCount(): number {
    return this.inquiries.filter((inq) => inq.status === 'unread').length;
  }

  public saveInquiry(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    source?: 'about_modal' | 'help_view' | 'contact_form';
  }): CustomerInquiry {
    const newInquiry: CustomerInquiry = {
      id: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || 'General Inquiry',
      message: data.message,
      createdAt: new Date().toISOString(),
      status: 'unread',
      source: data.source || 'contact_form'
    };

    this.inquiries = [newInquiry, ...this.inquiries];
    this.saveToStorage();
    return newInquiry;
  }

  public markAsRead(id: string): void {
    this.inquiries = this.inquiries.map((inq) =>
      inq.id === id ? { ...inq, status: 'read' as const } : inq
    );
    this.saveToStorage();
  }

  public markAsReplied(id: string): void {
    this.inquiries = this.inquiries.map((inq) =>
      inq.id === id ? { ...inq, status: 'replied' as const } : inq
    );
    this.saveToStorage();
  }

  public deleteInquiry(id: string): void {
    this.inquiries = this.inquiries.filter((inq) => inq.id !== id);
    this.saveToStorage();
  }

  public subscribe(listener: (inquiries: CustomerInquiry[]) => void): () => void {
    this.listeners.push(listener);
    listener([...this.inquiries]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.inquiries]));
  }
}

export const inquiryService = new InquiryService();
