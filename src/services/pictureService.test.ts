import {describe, expect, it} from "vitest";
import {PictureService} from "./pictureService";
import {DatabaseMock} from "../mocks/storage/database";
import {faker} from "@faker-js/faker/locale/en";

describe("PictureService", () => {
    const service = new PictureService("", "", "", new DatabaseMock(), null, null)

    it('should get pictures', async () => {
        const uploads = await service.get()
        expect(uploads.pictures[0].name).toBe("Album name")
        expect(uploads.userData.username).toBe("bob")
    })

    it('should create an album', async () => {
        const albumName = faker.internet.displayName()
        const album = await service.createAlbum(albumName)
        expect(album.name).toBe(albumName)
    });

    it('should fetch the albums', async () => {
        const albums = await service.getAlbums()
        expect(albums[0].name).toBe("Album name")
    });

    it('should fetch comments', async () => {
        const comments = await service.getComments("")
        expect(comments[0].comment).toBe("This is a comment")
    })
})