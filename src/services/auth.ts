import {AuthApi, Challenge, ChallengeDataOverride} from "../generated";

export class AuthChallenge {
    private challenge?: Challenge;

    constructor(private authApi: AuthApi) {}

    /**
     * Starts a new challenge for the provided endpoint
     * @param action Each authenticated endpoint in v3/auth or v3/account has its own action name (Example: passwordless registration: AUTH:PLE)
     * @param userId If the provided action points to an endpoint that modifies an existing user, provide it. For registration, don't.
     * @param override For registration or account info changes, this provides the (new) user data
     */
    async start(action: string, userId?: string, override?: ChallengeDataOverride): Promise<Challenge> {
        const resp = await this.authApi.registerChallenge({
            actionName: action,
            override: override,
            userId: userId,
        })

        this.challenge = resp.data;
        return resp.data;
    }

    /**
     * Starts a new challenge for the provided endpoint
     * @param name Name of the factor to verify (Example: SMS, EMAIL, PASSWORD)
     * @param credential The credential to verify the factor (SMS code, password, etc...)
     */
    async verifyFactor(name: string, credential: string): Promise<Challenge> {
        if (this.challenge === undefined) {
            throw new Error("Challenge not started");
        } else {
            const resp = await this.authApi.verifyFactor({
                challengeId: this.challenge.challengeId,
                factorName: name,
                credential: credential
            })

            this.challenge = resp.data;
            return resp.data;
        }
    }

    /**
     * Requests the credential for a specific factor when it's not static like a password (E-mail, SMS)
     * @param name Name of the factor to verify (Example: SMS, EMAIL)
     */
    async requestCredential(name: string): Promise<Challenge> {
        if (this.challenge === undefined) {
            throw new Error("Challenge not started");
        } else {
            const resp = await this.authApi.requestCredential({
                challengeId: this.challenge.challengeId,
                factorName: name,
            })

            this.challenge = resp.data;
            return resp.data;
        }
    }
}