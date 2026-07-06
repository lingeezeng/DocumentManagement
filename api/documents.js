import http from './http'

export const login = data => http.post('/auth/login', data)
export const batchUpload = formData => http.post('/documents/batch-upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const queryDocuments = params => http.get('/documents', { params })
export const updateDocument = (id, data) => http.put(`/documents/${id}`, data)
export const openDocumentUrl = id => `${import.meta.env.VITE_API_BASE_URL}/documents/${id}/open`
export const getStatistics = params => http.get('/statistics/summary', { params })
