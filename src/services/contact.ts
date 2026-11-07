import {Contact, ContactsApi} from "../generated";

const EXCLUDED_METHODS = ['getContacts', 'newContact'] as const;
type ExcludedMethods = typeof EXCLUDED_METHODS[number];
const excludeSet = new Set<string>(EXCLUDED_METHODS);

type OmitContactIdArg<T> = T extends (first: any, ...args: infer Rest) => infer R
    ? (...args: Rest) => R
    : T;

type WrappedDMHandler<T> = {
    [K in keyof T]: K extends ExcludedMethods
        ? T[K]
        : T[K] extends (...args: any[]) => any
            ? OmitContactIdArg<T[K]>
            : T[K];
};

function createContactWrapper<TFirst>(
    instance: ContactsApi,
    boundArg: TFirst
): WrappedDMHandler<ContactsApi> {
    return new Proxy(instance, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            if (typeof value === 'function' && !excludeSet.has(prop as string)) {
                return (...args: any[]) => value.call(target, boundArg, ...args);
            }
            return value;
        }
    }) as unknown as WrappedDMHandler<ContactsApi>;
}