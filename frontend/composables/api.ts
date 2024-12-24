export function $api<T>(
    request: Parameters<typeof $fetch<T>>[0],
    opts?: Parameters<typeof $fetch<T>>[1],
  ) {
    const auth = localStorage.getItem('access_token')
    if(auth) {
        return $fetch<T>(request, {
            ...opts,
            headers: {
              Authorization: `Bearer ${auth}`,
              ...opts?.headers,
            },
          })
    }
    return $fetch<T>(request, opts)
  }