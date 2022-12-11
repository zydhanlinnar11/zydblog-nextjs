import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { User } from '@/common/types/User'
import { backendFetcher } from '@/common/hooks/useAxios'
import useSWR from 'swr'

type State =
  | {
      state: 'LOADING'
      user: null
    }
  | {
      state: 'UNAUTHENTICATED'
      user: null
    }
  | {
      state: 'AUTHENTICATED'
      user: User
    }

type Action =
  | {
      type: 'LOG_IN'
      payload: User
    }
  | {
      type: 'SET_LOADING'
      payload: null
    }
  | {
      type: 'UNAUTHENTICATED'
      payload: null
    }

const reducer = (state: State, { payload, type }: Action): State => {
  switch (type) {
    case 'LOG_IN':
      return {
        state: 'AUTHENTICATED',
        user: payload,
      }
    case 'UNAUTHENTICATED':
      return {
        state: 'UNAUTHENTICATED',
        user: null,
      }
    case 'SET_LOADING':
      return {
        state: 'LOADING',
        user: null,
      }
    default:
      throw Error('Unrecognized action')
  }
}

const initialState: State = {
  state: 'LOADING',
  user: null,
}

const StateContext = createContext<State>(initialState)
const DispatchContext = createContext<Dispatch<Action>>(() => null)

export const UserProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { data, error, isLoading } = useSWR<User>(`/api/user`, backendFetcher)

  useEffect(() => {
    if (isLoading) dispatch({ payload: null, type: 'SET_LOADING' })
    else if (error || !data)
      dispatch({ type: 'UNAUTHENTICATED', payload: null })
    else if (data)
      dispatch({
        type: 'LOG_IN',
        payload: data,
      })
  }, [isLoading, data, error])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export const useUser = () => useContext(StateContext)
export const useUserDispatch = () => useContext(DispatchContext)
