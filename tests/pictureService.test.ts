import {describe, expect, it} from "vitest";
import {environment, SDKConfig} from "../src/core/environment";
import {NetworkService} from "../src/services/networkService";
import {DatabaseMock} from "../src/mocks/storage/database";
import {getClient} from "../src/core/http";
import {PictureService} from "../src/services/pictureService";
import {faker} from "@faker-js/faker/locale/en";

const PICTURE_SERVICE_TESTING_TOKEN = "testingToken"
const PICTURE_SERVICE_TESTING_USER_ID = "000000000000000000000000"
const PICTURE_SERVICE_TESTING_IMAGE_ID = "111111111111111111111111"

describe("PictureService Integration Test", () => {
    const service = new PictureService(
        PICTURE_SERVICE_TESTING_TOKEN,
        PICTURE_SERVICE_TESTING_USER_ID,
        PICTURE_SERVICE_TESTING_USER_ID,
        new DatabaseMock(),
        getClient(false),
        getClient(true),
    )

    it('should get uploads', async () => {
        const uploads = await service.get()
        expect(uploads.pictures[0].name).toBe("Album name")
    });

    it('should create an album', async () => {
        const albumName = faker.internet.displayName()
        await service.createAlbum(albumName)
        const uploads = await service.get()
        expect(uploads.pictures[1].name).toBe(albumName)
    });

    it('should delete image', async () => {
        await service.deletePicture(PICTURE_SERVICE_TESTING_IMAGE_ID)
        const uploads = await service.get()
        expect(uploads.pictures[0].images.length).toBe(0)
    });

    it('should change image visibility', async () => {
        await service.changeVisibility(PICTURE_SERVICE_TESTING_IMAGE_ID, "private")
        const uploads = await service.get()
        expect(uploads.pictures[0].images[0].visibility).toBe("private")
    });

    it('should edit image title', async () => {
        const newTitle = faker.internet.displayName()
        await service.editTitle(PICTURE_SERVICE_TESTING_IMAGE_ID, newTitle)
        const uploads = await service.get()
        expect(uploads.pictures[0].images[0].title).toBe(newTitle)
    });

    it('should post and get comment', async () => {
        const comment = faker.lorem.sentence()
        await service.postComment(PICTURE_SERVICE_TESTING_IMAGE_ID, comment)
        const comments = await service.getComments(PICTURE_SERVICE_TESTING_IMAGE_ID)
        expect(comments.length).not.toBe(0)
    });

    it('should fetch albums', async () => {
        const albums = await service.getAlbums()
        expect(albums[0].name).toBe("Album name")
    });
})