export class Organization {
    id?: number;
    creationDate?: string;
    updatingDate?: string;
    name!: string;
    code!: string;
    country!: string;
    phone!: string;
    fullAddress!: string;
    companies?: Company[];
  }
  
  export class Company {
    id?: number;
    creationDate?: string;
    updatingDate?: string;
    name!: string;
    organizationId!: number;
    organization?: string;
  }
  