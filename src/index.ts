import {
    AuthApi,
    AccountApi,
    Configuration,
    ContactsApi,
    DirectMessagingApi,
    FileTransferApi,
    CascadeApi, ThreadApi, ThreadMessage, ThreadMessagesApi, PicturesCreatorApi, PicturesApi, PictureCommentsApi,
    PictureAlbumApi, CascadeInviteApi, RanksApi
} from "./generated";

export class ChateniumClient {
    public auth: AuthApi;
    public account: AccountApi;
    public contacts: ContactsApi;
    public directMessaging: DirectMessagingApi;
    public fileTransfers: FileTransferApi;
    public cascades: CascadeApi;
    public threads: ThreadApi;
    public threadMessages: ThreadMessagesApi;
    public pictureCreator: PicturesCreatorApi;
    public pictures: PicturesApi;
    public pictureComments: PictureCommentsApi;
    public pictureAlbums: PictureAlbumApi;
    public cascadeInvites: CascadeInviteApi;
    public cascadeRanks: RanksApi;

    private apiConfig: Configuration;

    constructor(config: { baseUrl: string }) {
        this.apiConfig = new Configuration({
            basePath: config.baseUrl+"/v3",
        })

        this.auth = new AuthApi(this.apiConfig);
        this.account = new AccountApi(this.apiConfig);
        this.contacts = new ContactsApi(this.apiConfig);
        this.directMessaging = new DirectMessagingApi(this.apiConfig);
        this.fileTransfers = new FileTransferApi(this.apiConfig);
        this.cascades = new CascadeApi(this.apiConfig);
        this.threads = new ThreadApi(this.apiConfig);
        this.pictureCreator = new PicturesCreatorApi(this.apiConfig);
        this.threadMessages = new ThreadMessagesApi(this.apiConfig);
        this.pictures = new PicturesApi(this.apiConfig);
        this.pictureComments = new PictureCommentsApi(this.apiConfig);
        this.pictureAlbums = new PictureAlbumApi(this.apiConfig);
        this.cascadeInvites = new CascadeInviteApi(this.apiConfig);
        this.cascadeRanks = new RanksApi(this.apiConfig);
    }

    addHeader(name: string, value: string) {
        this.apiConfig.baseOptions.headers[name] = value;
        this.refreshHandlers();
    }

    refreshHandlers() {
        this.auth = new AuthApi(this.apiConfig);
        this.account = new AccountApi(this.apiConfig);
        this.contacts = new ContactsApi(this.apiConfig);
        this.directMessaging = new DirectMessagingApi(this.apiConfig);
        this.fileTransfers = new FileTransferApi(this.apiConfig);
        this.cascades = new CascadeApi(this.apiConfig);
        this.threads = new ThreadApi(this.apiConfig);
        this.pictureCreator = new PicturesCreatorApi(this.apiConfig);
        this.threadMessages = new ThreadMessagesApi(this.apiConfig);
        this.pictures = new PicturesApi(this.apiConfig);
        this.pictureComments = new PictureCommentsApi(this.apiConfig);
        this.pictureAlbums = new PictureAlbumApi(this.apiConfig);
        this.cascadeInvites = new CascadeInviteApi(this.apiConfig);
        this.cascadeRanks = new RanksApi(this.apiConfig);
    }
}

export * from "./services/auth";
export * from "./generated";