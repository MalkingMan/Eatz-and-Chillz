export enum UserRole {
  GM = 'General Manager',
  RM = 'Region Manager',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export enum MenuItemStatus {
  ACTIVE = 'Active',
  DRAFT = 'Draft',
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  status: MenuItemStatus;
  category: string;
}

export enum ProposalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface Proposal {
  id: string;
  menuName: string;
  submittedBy: string; // Region Name or Manager Name
  date: string;
  price: number;
  status: ProposalStatus;
  description: string;
}
