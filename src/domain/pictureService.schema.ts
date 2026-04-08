import {PublicUserData, TimeStamp} from './common.schema.js';

// Request schemas
export interface GetReq {
    userid: string
    target: string
}

export interface CreateAlbumReq {
    name: string
    userid: string
}

export interface FinalizeUploadReq {
    userid: string
    uploadId: string
}

export interface DeleteImageReq {
    userid: string
    imageId: string
}

export interface ChangePictureVisibilityReq {
    visibility: string
    userid: string
    imageId: string
}

export interface EditPictureTitleReq {
    title: string
    userid: string
    imageId: string
}

export interface TogglePictureLikeReq {
    userid: string
    imageId: string
}

export interface PostCommentReq {
    comment: string
    userid: string
    imageId: string
}

export interface ToggleFollowReq {
    uploaderId: string
    userid: string
}

export interface GetAlbumReq {
    userid: string
}

export interface GetCommentsReq {
    imageId: string
}

export interface UploadImageReq {
    userid: string
    picture: string
    title: string
    visibility: string
    album: string
    uploadId: string
    name: string
}

// Response schemas
export interface GetResp {
    userData: PublicUserData
    pictures: Album[]
}

export interface DiscoveryResp {
    recent: Image[]
    mostLiked: Image[]
}

// Types
export interface Album {
    created_at: TimeStamp
    name: string
    albumId: string
    images: Image[]
}

export interface Image {
    path: string
    visibility: string
    title: string
    imageId: string
    uploaded_at: TimeStamp
    liked: boolean
    likes: number
    userData: PublicUserData | null
}

export interface Comment {
    commentId: string
    author: string
    imageId: string
    comment: string
    commented_at: TimeStamp
    username: string
    pfp: string
    displayName: string
}