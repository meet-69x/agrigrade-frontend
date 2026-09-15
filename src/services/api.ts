const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function getApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('agrigrade_token');
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMessage);
    }

    // Handle empty or blob responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf')) {
      return (await response.blob()) as unknown as T;
    }
    
    return await response.json();
  } catch (err: any) {
    console.warn(`[API Call Failed] ${endpoint}:`, err.message || err);
    throw err;
  }
}
