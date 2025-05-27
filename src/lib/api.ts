// API utility functions for frontend-backend integration

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  featured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceId?: string;
  service?: Service;
  description: string;
  preferredDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  published: boolean;
  featured: boolean;
  tags: string[];
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStatistics {
  contacts: { total: number; pending: number };
  consultations: { total: number; pending: number };
  users: { total: number };
  testimonials: { total: number; pending: number };
  newsletter: { subscribers: number };
  blog: { total: number; published: number };
}

export interface RecentActivity {
  contacts: Contact[];
  consultations: Consultation[];
}

export interface MonthlyStats {
  month: string;
  contacts: number;
  consultations: number;
}

// Base API function with error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Une erreur est survenue' };
    }

    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Erreur de connexion au serveur' };
  }
}

// Services API
export const servicesApi = {
  getAll: () => apiCall<{ services: Service[] }>('/api/services'),
  
  create: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiCall<{ service: Service }>('/api/services', {
      method: 'POST',
      body: JSON.stringify(service),
    }),

  update: (id: string, service: Partial<Service>) =>
    apiCall<{ service: Service }>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/api/services/${id}`, {
      method: 'DELETE',
    }),
};

// Testimonials API
export const testimonialsApi = {
  getAll: () => apiCall<{ testimonials: Testimonial[] }>('/api/testimonials'),
  
  create: (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiCall<{ testimonial: Testimonial }>('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    }),
  
  updateStatus: (id: string, status: string) =>
    apiCall<{ testimonial: Testimonial }>(`/api/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  update: (id: string, testimonial: Partial<Testimonial>) =>
    apiCall<{ testimonial: Testimonial }>(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonial),
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/api/testimonials/${id}`, {
      method: 'DELETE',
    }),
};

// Contact API
export const contactsApi = {
  create: (contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
  }) =>
    apiCall<{ contact: { id: string } }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contact),
    }),
  
  getAll: (page = 1, limit = 50, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return apiCall<{
      contacts: Contact[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/api/contact?${params}`);
  },

  updateStatus: (id: string, status: string) =>
    apiCall<{ contact: Contact }>(`/api/contact/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/api/contact/${id}`, {
      method: 'DELETE',
    }),
};

// Consultations API
export const consultationsApi = {
  create: (consultation: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    serviceId?: string;
    description: string;
    preferredDate?: string;
  }) =>
    apiCall<{ consultation: Consultation }>('/api/consultations', {
      method: 'POST',
      body: JSON.stringify(consultation),
    }),
  
  getAll: (page = 1, limit = 50, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return apiCall<{
      consultations: Consultation[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/api/consultations?${params}`);
  },

  updateStatus: (id: string, status: string) =>
    apiCall<{ consultation: Consultation }>(`/api/consultations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  update: (id: string, consultation: Partial<Consultation>) =>
    apiCall<{ consultation: Consultation }>(`/api/consultations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(consultation),
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/api/consultations/${id}`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersApi = {
  getAll: (page = 1, limit = 50) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return apiCall<{
      users: User[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/api/users?${params}`);
  },

  updateRole: (id: string, role: string) =>
    apiCall<{ user: User }>(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  update: (id: string, user: Partial<User>) =>
    apiCall<{ user: User }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/api/users/${id}`, {
      method: 'DELETE',
    }),
};

// Newsletter API
export const newsletterApi = {
  subscribe: (email: string, name?: string) =>
    apiCall<{ message: string }>('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    }),
  
  unsubscribe: (email: string) =>
    apiCall<{ message: string }>(`/api/newsletter?email=${encodeURIComponent(email)}`, {
      method: 'DELETE',
    }),

  getAll: (page = 1, limit = 50) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return apiCall<{
      subscribers: NewsletterSubscriber[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/api/newsletter?${params}`);
  },

  delete: (id: string) =>
    apiCall<{ message: string }>(`/api/newsletter/${id}`, {
      method: 'DELETE',
    }),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiCall<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (name: string, email: string, password: string) =>
    apiCall<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  
  logout: () =>
    apiCall<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }),
};

// Admin Dashboard API
export const adminApi = {
  getDashboard: () =>
    apiCall<{
      statistics: DashboardStatistics;
      recentActivity: RecentActivity;
      monthlyStats: MonthlyStats[];
    }>('/api/admin/dashboard'),
};

// Blog API
export const blogApi = {
  getAll: (page = 1, limit = 10, published?: boolean, featured?: boolean, tag?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(published !== undefined && { published: published.toString() }),
      ...(featured !== undefined && { featured: featured.toString() }),
      ...(tag && { tag }),
    });
    return apiCall<{
      posts: BlogPost[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/api/blog?${params}`);
  },
  
  getById: (id: string) =>
    apiCall<{ post: BlogPost }>(`/api/blog/${id}`),

  create: (post: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    published?: boolean;
    featured?: boolean;
    tags?: string[];
  }) =>
    apiCall<{ post: BlogPost }>('/api/blog', {
      method: 'POST',
      body: JSON.stringify(post),
    }),

  update: (id: string, post: Partial<BlogPost>) =>
    apiCall<{ post: BlogPost }>(`/api/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/api/blog/${id}`, {
      method: 'DELETE',
    }),
}; 