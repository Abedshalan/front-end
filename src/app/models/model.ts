export class Organization {
    id?: number;
    creationDate!: string;
    updatingDate!: string;
    name!: string;
    code!: string;
    country!: string;
    phone!: string;
    fullAddress!: string;
    companies!: Company[];
  }
  
  export class Company {
    id?: number;
    creationDate!: string;
    updatingDate!: string;
    name!: string;
    organizationId!: number;
    code!: string;
    country!: string;
    phone!: string;
    fullAddress!: string;
    organization: Organization | undefined = new Organization();
    organizationName!:string;
  }
  export class ResponseResult<T>{
    succeeded?: boolean;
    data!: T[];
    msg?: string;
    total?: number
  }
  export class PagedResult<T>{
    totalCount?: number;
    data!: T[];
    pageNumber?: number;
    totalPages?: number;
    pageSize?: number;
  }
  export class SelectItem
	{
       label!:string
       value!:string
  }