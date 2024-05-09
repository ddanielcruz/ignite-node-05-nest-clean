import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { EnvService } from '@/env/env.service'

import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        const privateKey = envService.get('JWT_PRIVATE_KEY')
        const publicKey = envService.get('JWT_PUBLIC_KEY')
        const expiresIn = envService.get('JWT_EXPIRES_IN')

        return {
          global: true,
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
          signOptions: {
            algorithm: 'RS256',
            expiresIn,
          },
        }
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
