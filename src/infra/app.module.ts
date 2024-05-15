import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/events.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [AuthModule, EnvModule, EventsModule, HttpModule],
})
export class AppModule {}
