import { User } from '@/common/types/User'
import { AbstractProvider } from '@/auth/backend/providers/OAuth2/AbstractProvider'

type NewUser = {
  id: string
  email: string
  name: string
}

export interface IUserRepository {
  getByProvider: (
    Provider: typeof AbstractProvider,
    socialId: any
  ) => Promise<User | null>

  getByEmail: (email: string) => Promise<User | null>

  getById: (id: string) => Promise<User | null>

  create: (user: NewUser) => Promise<void>

  linkToSocial: (
    Provider: typeof AbstractProvider,
    socialId: any,
    userId: string
  ) => Promise<void>
}