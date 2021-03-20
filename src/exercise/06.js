// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, { useState, useEffect } from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'

import { PokemonForm } from '../pokemon'

const PokemonInfo = ({ pokemonName }) => {
  const [{ status, pokemon, error }, setState] = useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null
  })

  useEffect(() => {
    if (!pokemonName) return

    setState({ status: 'pending' })

    fetchPokemon(pokemonName).then(
      pokemon => {
        // setPokemon(pokemon)
        // setStatus('resolved')
        /* 
        This would lead to an error
        because this triggers 2 renders in a row
        the 1st fails: status was set to resolved
        and it triggers the rendering of PokemonDataView before the pokemon state is set
        (normally react batches this setState calls but it can't in an async callback)
        */
        // setStatus('resolved')
        // setPokemon(pokemon)

        setState({ pokemon, status: 'resolved' })
      },
      error => {
        setState({ error, status: 'rejected' })
      }
    )
  }, [pokemonName])

  if (!status) throw new Error('This should be impossible')
  if (error) throw error
  return status === 'idle' ? (
    'Submit a pokemon'
  ) : status === 'pending' ? (
    <PokemonInfoFallback name={pokemonName} />
  ) : status === 'resolved' ? (
    <PokemonDataView pokemon={pokemon} />
  ) : null
}

const Error = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    There was an error:{' '}
    <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
)

const App = () => {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* key attribute is to force resetting
        the ErrorBoundary component to rebuilt the subtree */}
        <ErrorBoundary
          FallbackComponent={Error}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
