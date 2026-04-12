export type PlatformListItem = {
  id: string;
  slug: string;
  name: string;
  orderIndex: number;
  iconClass: string;
  colorCode: string;
  title: string;
  description: string;
  image: string;
  seoData?: unknown;
};

export type PlatformCategory = {
  id: string;
  name: string;
  slug: string;
  hasPackage: boolean;
  orderIndex: number;
};

export type PlatformAction = {
  id: string;
  key: string;
  name: string;
  image: string | null;
  orderIndex: number;
  categories: PlatformCategory[];
};

export type PlatformDetail = {
  id: string;
  slug: string;
  name: string;
  iconUrl: string | null;
  iconClass: string;
  colorCode: string;
  orderIndex: number;
  title: string;
  description: string;
  image: string;
  seoData?: unknown;
  actions: PlatformAction[];
};

export type ApiListResponse<T> = {
  success: boolean;
  data: T[];
};

export type ApiDetailResponse<T> = {
  success: boolean;
  data: T;
};
