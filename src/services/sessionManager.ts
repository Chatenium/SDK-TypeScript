import {PublicUserData} from '../domain/common.schema.js';
import {DatabaseAPI} from '../storage/database.js';
import {KeyringAPI} from '../storage/keyring.js';
import {KeyValueAPI} from '../storage/keyvalue.js';
import {Session, ValidateSessionReq, ValidateSessionResp} from '../domain/sessionManager.schema.js';
import {AxiosInstance} from "axios";
import {getClient} from '../core/http.js';
import {PersonalUserData} from '../domain/userService.schema.js';

export class SessionManager {
    client: AxiosInstance;
    database: DatabaseAPI;
    keyring: KeyringAPI;
    KeyValue: KeyValueAPI;

    constructor(database: DatabaseAPI, keyring: KeyringAPI, KeyValue: KeyValueAPI) {
        this.database = database;
        this.keyring = keyring;
        this.KeyValue = KeyValue;
        this.client = getClient(false)
    }

    /**
     * Saves the new session to the database and the keyring
     * @param userData
     * @param token
     */
    addSession(userData: PublicUserData, token: string): void {
        this.database.set("sessions", userData.userid, JSON.stringify(userData))
        this.keyring.set(userData.userid, token)
    }

    /**
     * Loads all saved sessions
     */
    async loadSessions(): Promise<Session[]> {
        const tokens = await this.keyring.getAll()
        const sessions: Session[] = []

        for (const tokenKey of tokens) {
            try {
                const token = await this.keyring.get(tokenKey)
                const userData = await this.database.get("sessions", tokenKey)

                if (userData && userData.trim().length > 0) {
                    sessions.push({
                        token: token,
                        userData: JSON.parse(userData)
                    })
                }
            } catch (e) {
                console.error(`Failed to parse session for ${tokenKey}:`, e)
                continue
            }
        }

        return sessions
    }

    /**
     * Gets the preferred user set by the client
     */
    async getPreferredUser(): Promise<string> {
        return await this.KeyValue.get("preferredUser") ?? ""
    }

    /**
     * Sets a new preferred user
     * @param userid
     */
    setPreferredUser(userid: string): void {
        this.KeyValue.set("preferredUser", userid)
    }

    /**
     * Loads the preferred session by the client
     */
    async loadPreferredSession() {
        const sessions = await this.loadSessions()

        if (sessions.length == 0) {
            throw new Error("No sessions found")
        }

        let preferredUser = await this.getPreferredUser()
        if (preferredUser == "") {
            preferredUser = sessions[0].userData.userid
            this.setPreferredUser(sessions[0].userData.userid)
        }

        const preferredSession = sessions.find(s => s.userData.userid == preferredUser)
        if (preferredSession) {
            return preferredSession
        } else {
            return sessions[0]
        }
    }

    /**
     * Validates and updates all sessions and returns with a new session list
     * @param sessions
     */
    updateSessions(sessions: Session[]): Session[] {
        sessions.forEach(async session => {
            const index = sessions.indexOf(session)
            if (!await this.validateSession(session.token)) {
                this.database.delete("sessions", session.userData.userid)
                this.keyring.delete(session.userData.userid)
                sessions.splice(index, 1)
            }

            const updatedUserData = await this.updateUserData(session)
            this.database.set("sessions", session.userData.userid, updatedUserData)
            sessions[index] = updatedUserData
        })

        return sessions
    }

    private async validateSession(token: string): Promise<boolean> {
        try {
            const resp = await this.client.post<ValidateSessionResp>("v2/user/validateSession", <ValidateSessionReq>{
                token: token,
            })
            return resp.data.validationOk
        } catch (e) {
            return true
        }
    }

    private async updateUserData(session: Session): Promise<Session> {
        const authenticatedClient = this.client.create({
            headers: {
                "Authorization": session.token,
            }
        })

        try {
            const resp = await authenticatedClient.get<PersonalUserData>(`user/byUseridPersonal?userid=${session.userData.userid}`)
            session.userData = resp.data
            return session
        } catch (e) {
            throw new Error("Session update error")
        }
    }
}