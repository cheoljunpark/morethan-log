const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export async function requestWithRetry<T>(
  request: () => Promise<T>,
  retries = 5
): Promise<T> {
  let lastError: unknown
  const retryableStatusCodes = new Set([429, 502, 503, 504])

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await request()
    } catch (error: any) {
      lastError = error
      const statusCode = error?.response?.statusCode
      if (!retryableStatusCodes.has(statusCode) || attempt === retries) {
        throw error
      }

      await sleep(1200 * (attempt + 1))
    }
  }

  throw lastError
}
