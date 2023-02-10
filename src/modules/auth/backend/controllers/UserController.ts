import { BaseController } from '@/common/backend/controllers/BaseController'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import { userRepository } from '../providers/dependencies'

export class UserController extends BaseController {
  public linkedSocial = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    const userId = session?.user.id
    if (!userId) return BaseController.unauthorized(res)

    return res.send(await userRepository.getLinkedSocial(userId))
  }
}
