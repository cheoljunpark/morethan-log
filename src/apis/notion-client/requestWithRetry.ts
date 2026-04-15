const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export async function requestWithRetry<T>(
  request: () => Promise<T>,
  retries = 3
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await request()
    } catch (error: any) {
      lastError = error
      const statusCode = error?.response?.statusCode
      if (statusCode !== 429 || attempt === retries) {
        throw error
      }

      await sleep(1000 * (attempt + 1))
    }
  }

  throw lastError
}
