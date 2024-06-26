import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { EnvService } from '@/infra/env/env.service'

const tokenPayloadSchema = z.object({
  sub: z.string(),
})

export type TokenPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: unknown) {
    return tokenPayloadSchema.parse(payload)
  }
}
