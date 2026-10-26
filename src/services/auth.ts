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
}