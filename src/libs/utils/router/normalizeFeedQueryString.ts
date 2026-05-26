const normalizeFeedQueryString = (rawQueryString?: string | null) => {
  if (!rawQueryString) return ""

  const normalizedInput = rawQueryString.startsWith("?")
    ? rawQueryString
    : `?${rawQueryString}`

  const params = new URLSearchParams(normalizedInput)

  Array.from(params.keys()).forEach((key) => {
    const value = params.get(key)

    if (!value || value.trim().length === 0) {
      params.delete(key)
    }
  })

  const serialized = params.toString()
  return serialized ? `?${serialized}` : ""
}

export default normalizeFeedQueryString
