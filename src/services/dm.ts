import {DirectMessagingApi} from "../generated";

type OmitContactIdArg<T> = T extends (first: any, ...args: infer Rest) => infer R
    ? (...args: Rest) => R
    : T;

type WrappedDMHandler<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? OmitContactIdArg<T[K]> : T[K];
};

export function createDMHandler<TFirst>(instance: DirectMessagingApi, contactId: TFirst): WrappedDMHandler<DirectMessagingApi> {
    return new Proxy(instance, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            if (typeof value === 'function') {
                return (...args: any[]) => value.call(target, contactId, ...args);
            }
            return value;
        }
    }) as unknown as WrappedDMHandler<DirectMessagingApi>;
}