// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({ initialName = '' }) {
  // 🐨 initialize the state to the value from localStorage

  console.log('renders child')
  const useLocalStorageState = (
    defaultState = {},
    key,
    { serialize = JSON.stringify, deserialize = JSON.parse } = {}
  ) => {
    // lazy state init
    const [state, setState] = React.useState(() => {
      console.log('first render')
      return (
        deserialize(localStorage.getItem(key)) ||
        (typeof defaultState === 'function' ? defaultState() : defaultState)
      )
    })

    const prevRef = React.useRef(key)

    React.useEffect(() => {
      console.log('useEffect child')
      const prevKey = prevRef.current
      prevKey !== key && localStorage.removeItem(prevKey)

      prevRef.current = key
      localStorage.setItem(key, serialize(state))
    }, [key, state, serialize])

    return [state, setState]
  }

  const [{ name }, setName] = useLocalStorageState(
    { name: 1, learns: 'react' },
    'name'
  )

  function handleChange(event) {
    setName({ name: event.target.value })
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  console.log('render parent')
  const [count, setCount] = React.useState(0)
  return (
    <>
      <button onClick={() => setCount(previousCount => previousCount + 1)}>
        {count}
      </button>
      <Greeting />
    </>
  )
}

export default App
