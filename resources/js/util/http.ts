import ky, { KyInstance, Options } from "ky";

export function http(prefix: string, options?: Options): KyInstance {
    return ky.extend({
        prefixUrl: `http://localhost:8000${prefix}`,
        credentials: "include",
        hooks: {
            beforeRequest: [
                request => {
                    request.headers.set('X-XSRF-TOKEN', getCookieValue("XSRF-TOKEN") ?? "");
                }
            ]

        },
        ...options
    });
}


function getCookieValue(name: string): string | undefined {
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = decodeURIComponent(document.cookie).match(regex)
    if (match) {
        return match[2]
    }
}