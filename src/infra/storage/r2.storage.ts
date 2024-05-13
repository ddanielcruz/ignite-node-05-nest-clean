import { randomUUID } from 'node:crypto'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

import {
  Uploader,
  UploadObject,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'

import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
  private readonly client: S3Client
  private readonly bucketName: string

  constructor(env: EnvService) {
    const cfAccountId = env.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${cfAccountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
    this.bucketName = env.get('AWS_S3_BUCKET_NAME')
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<UploadObject> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueFileName,
        Body: body,
        ContentType: fileType,
      }),
    )

    return { url: uniqueFileName }
  }
}
