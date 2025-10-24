import { Timestamp } from 'firebase/firestore';

// User Settings
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'nb-NO' | 'en-US' | 'sv-SE' | 'da-DK';
  currency: 'NOK' | 'USD' | 'EUR' | 'SEK' | 'DKK';
  notifications: {
    enabled: boolean;
    lowStock: boolean;
    loanReminders: boolean;
    projectDeadlines: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    showProfile: boolean;
    allowAnalytics: boolean;
  };
}

// User Model
export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  googleUid?: string;
  appleUid?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: UserSettings;
  households: string[]; // Array of household IDs user is member of
  subscriptionTier: 'free' | 'pro' | 'team';
  subscriptionStatus?: 'active' | 'inactive' | 'trial' | 'cancelled';
  subscriptionExpiresAt?: Timestamp;
}

// Household Member Role
export type HouseholdRole = 'owner' | 'admin' | 'editor' | 'viewer';

// Household Member
export interface HouseholdMember {
  uid: string;
  role: HouseholdRole;
  joinedAt: Timestamp;
  invitedBy: string;
}

// Household Settings
export interface HouseholdSettings {
  defaultCurrency: string;
  lowStockThreshold: number;
  allowGuestAccess: boolean;
  requireApprovalForNewMembers: boolean;
}

// Household Model
export interface Household {
  id: string;
  name: string;
  description?: string;
  address?: string;
  icon?: string;
  color?: string;
  ownerId: string;
  members: { [uid: string]: HouseholdMember };
  settings: HouseholdSettings;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  itemCount?: number;
  totalValue?: number;
}

// Custom Field Types
export type CustomFieldType = 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'url';

export interface CustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[]; // For dropdown type
  defaultValue?: string | number | boolean | Date;
  order: number;
}

// Category Model
export interface Category {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  customFields: CustomField[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  itemCount?: number;
}

// Location Model
export interface Location {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  parentId?: string; // For hierarchical locations
  icon?: string;
  color?: string;
  qrCode?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  itemCount?: number;
  path?: string[]; // Breadcrumb path for hierarchy
}

// Item Model
export interface Item {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  categoryId: string;
  locationId?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  barcode?: string;
  purchasePrice?: number;
  purchaseDate?: Timestamp;
  purchaseLocation?: string;
  quantity: number;
  unit: string;
  minStock?: number;
  images: string[]; // URLs to Firebase Storage
  attachments?: string[]; // URLs to Firebase Storage (PDFs, etc.)
  tags: string[];
  customFields: Record<string, string | number | boolean | Date>;
  qrCode?: string;
  notes?: string;
  warranty?: {
    expiresAt: Timestamp;
    document?: string;
  };
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isArchived?: boolean;
}

// Project Status
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

// Project Task
export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: Timestamp;
  assignedTo?: string;
}

// Project Material
export interface ProjectMaterial {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
  purchased: boolean;
}

// Project Model
export interface Project {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: Timestamp;
  deadline?: Timestamp;
  completedAt?: Timestamp;
  budget?: number;
  actualCost?: number;
  materialList: ProjectMaterial[];
  tasks: ProjectTask[];
  attachments?: string[];
  notes?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Loan Status
export type LoanStatus = 'active' | 'overdue' | 'returned';

// Loan Contact
export interface LoanContact {
  name: string;
  email?: string;
  phone?: string;
  contactId?: string; // Google Contacts ID
}

// Loan Model
export interface Loan {
  id: string;
  householdId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  loanedTo: LoanContact;
  loanDate: Timestamp;
  dueDate?: Timestamp;
  returnedDate?: Timestamp;
  status: LoanStatus;
  notes?: string;
  reminderSent?: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Invitation Model
export interface Invitation {
  id: string; // Token
  householdId: string;
  householdName: string;
  invitedBy: string;
  invitedByName: string;
  role: HouseholdRole;
  email?: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  acceptedBy?: string;
}

// Share Access Level
export type ShareAccessLevel = 'view' | 'comment' | 'edit';

// Share Model
export interface Share {
  id: string;
  householdId: string;
  itemId?: string; // If sharing specific item
  locationId?: string; // If sharing specific location
  projectId?: string; // If sharing specific project
  createdBy: string;
  accessLevel: ShareAccessLevel;
  password?: string; // Hashed password (optional)
  requiresAuth: boolean;
  expiresAt?: Timestamp;
  viewCount: number;
  lastViewedAt?: Timestamp;
  createdAt: Timestamp;
}

// Product Database (Community)
export interface ProductDatabase {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  image?: string;
  addedBy: string;
  addedAt: Timestamp;
  verified: boolean;
}

