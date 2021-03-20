import { useState, useEffect, useRef } from 'react'

export const useLocalStorageState = (
  defaultState = {},
  key,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) => {
  // lazy state init
  const [state, setState] = useState(() => {
    console.log('first render')
    return (
      deserialize(localStorage.getItem(key)) ||
      (typeof defaultState === 'function' ? defaultState() : defaultState)
    )
  })

  const prevRef = useRef(key)

  useEffect(() => {
    console.log('useEffect child')
    const prevKey = prevRef.current
    prevKey !== key && localStorage.removeItem(prevKey)

    prevRef.current = key
    localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}
