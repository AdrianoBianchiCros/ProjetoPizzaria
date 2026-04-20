const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export function getApiurl() {
    return API_URL
}

interface FechOptins extends RequestInit {
    token?: string,
    cache?: "force-cache" | "no-store",
    next?: {
        revalidate?: number | 0 | false,
        tags?: string[]
    }
}

export async function apiClient<T>(
    endpoint: string,
    options: FechOptins = {}
): Promise<T> {
    const { token, ...fechOptions } = options

    const headers: Record<string, string> = {
        ...(fechOptions.headers as Record<string, string>)
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    if (!(fechOptions.body instanceof FormData)) {
        headers["Content-Type"] = "application/json"
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fechOptions,
        headers
    })

    const contentType = response.headers.get("content-type") ?? ""
    const responseText = await response.text()
    const responseData = contentType.includes("application/json") && responseText
        ? JSON.parse(responseText)
        : responseText

    if (!response.ok) {
        const errorMessage =
            typeof responseData === "object" && responseData !== null && "error" in responseData
                ? String(responseData.error)
                : `ERROR HTTP: ${response.status}`

        throw new Error(errorMessage || "Erro na requisição")
    }

    return responseData as T
}
