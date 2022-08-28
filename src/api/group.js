import request from '@/utils/request'

export function fetchMemberList() {
  return request({
    url: '/group/memberList',
    method: 'get'
  })
}

export function fetchGroupList() {
  return request({
    url: '/group/groupList',
    method: 'get'
  })
}

export function createGroup(data) {
  return request({
    url: '/group/create',
    method: 'post',
    data
  })
}

export function deleteGroup(data) {
  return request({
    url: '/group/delete',
    method: 'post',
    data
  })
}

export function getPeople(groupId) {
  return request({
    url: '/group-member/people',
    method: 'get',
    params: { groupId }
  })
}

export function getPersonInfo(personId) {
  return request({
    url: '/group-member/personInfo',
    method: 'get',
    params: { personId }
  })
}

export function getFile(groupId) {
  return request({
    url: '/group-file/getFile',
    method: 'get',
    params: { groupId }
  })
}

export function getFileInfo(fileId, groupId) {
  return request({
    url: '/group-file/getFileInfo',
    method: 'get',
    params: { fileId, groupId }
  })
}

export function deleteFile(data) {
  return request({
    url: '/group-file/deleteFile',
    method: 'post',
    data
  })
}

export function updateName(data) {
  return request({
    url: '/group-file/updateName',
    method: 'post',
    data
  })
}

export function getDiscussion(groupId, title) {
  return request({
    url: '/group-discussion/getDiscussion',
    method: 'get',
    params: { groupId, title }
  })
}

export function deleteDiscussion(data) {
  return request({
    url: '/group-discussion/deleteDiscussion',
    method: 'post',
    data
  })
}

export function addDiscussion(data) {
  return request({
    url: '/group-discussion/addDiscussion',
    method: 'post',
    data
  })
}

export function getDetail(discussionId) {
  return request({
    url: '/group-discussion/getDetail',
    method: 'get',
    params: { discussionId }
  })
}

export function getComments(discussionId) {
  return request({
    url: '/group-discussion/getComments',
    method: 'get',
    params: { discussionId }
  })
}

export function addComment(data) {
  return request({
    url: '/group-discussion/addComment',
    method: 'post',
    data
  })
}

export function deleteComment(commentId) {
  return request({
    url: '/group-discussion/deleteComment',
    method: 'post',
    params: { commentId }
  })
}
