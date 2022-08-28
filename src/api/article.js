import request from '@/utils/request'

export function fetchList(title) {
  return request({
    url: '/document/list',
    method: 'get',
    params: { title }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function createDocument(data) {
  return request({
    url: '/document/create',
    method: 'post',
    data
  })
}

export function updateDocument(data) {
  return request({
    url: '/document/update',
    method: 'post',
    data
  })
}

export function deleteDocument(data) {
  return request({
    url: '/document/delete',
    method: 'post',
    data
  })
}

export function uploadDocument(file) {
  return request({
    url: '/pdf/upload',
    method: 'post',
    file
  })
}

export function getPdf(pdfId) {
  return request({
    url: '/pdf/get',
    method: 'get',
    params: { pdfId }
  })
}

export function deletePdf(pdfId) {
  return request({
    url: '/pdf/delete',
    method: 'post',
    params: { pdfId }
  })
}
