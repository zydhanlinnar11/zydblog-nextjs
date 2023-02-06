import { OAuth2User } from '@/auth/backend/models/OAuth2User'
import axios from 'axios'
import { NextApiRequest } from 'next'

export abstract class AbstractProvider {
  static id: string
  static providerName: string

  protected scopes: string[] = []
  protected scopeSeparator: string = ','
  protected user: OAuth2User | null = null

  constructor(
    protected clientId: string,
    protected clientSecret: string,
    protected redirectUri: string
  ) {}

  protected abstract getAuthUrl: (state: string) => string
  protected abstract getTokenUrl: () => string
  protected abstract getUserByToken: (token: string) => Promise<object>
  protected abstract mapUserToClass: (user: any) => OAuth2User

  public getRedirectUrl = () => {
    // TODO: implement State and/or PKCE verification

    return this.getAuthUrl('')
  }

  protected buildAuthUrlFromBase = (url: string, state: string) => {
    const searchParams = new URLSearchParams()
    const codeFields = this.getCodeFields(state)
    // @ts-ignore
    for (let key in codeFields) searchParams.append(key, codeFields[key])
    return `${url}?${searchParams.toString()}`
  }

  protected getCodeFields = (state: string) => {
    // TODO: implement State and/or PKCE verification
    return {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.formatScopes(),
      response_type: 'code',
    }
  }

  protected formatScopes = () => {
    return this.scopes.join(this.scopeSeparator)
  }

  public getUser = async (req: NextApiRequest) => {
    if (this.user) return this.user

    // TODO: implement State and/or PKCE verification
    const response = await this.getAccessTokenResponse(this.getCode(req))
    this.user = this.mapUserToClass(
      await this.getUserByToken(response.access_token)
    )

    return this.user
  }

  public getAccessTokenResponse = async (code: string) => {
    return (
      await axios.post(this.getTokenUrl(), this.getTokenFields(code), {
        headers: { Accept: 'application/json' },
      })
    ).data
  }

  protected getTokenFields = (code: string) => {
    return {
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      redirect_uri: this.redirectUri,
    }
    // TODO: implement State and/or PKCE verification
  }

  protected getCode = (req: NextApiRequest) =>
    JSON.parse(JSON.stringify(req.query['code']))
}