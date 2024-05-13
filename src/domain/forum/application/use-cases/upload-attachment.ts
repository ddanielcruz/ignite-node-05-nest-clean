import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

export type UploadAttachmentRequest = {
  fileName: string
  fileType: string
  body: Buffer
}

export type UploadAttachmentResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAttachment {
  private readonly supportedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
  ]

  constructor(
    private readonly attachmentsRepo: AttachmentsRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAttachmentRequest): Promise<UploadAttachmentResponse> {
    if (!this.supportedTypes.includes(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })
    const attachment = new Attachment({ title: fileName, url })

    await this.attachmentsRepo.create(attachment)

    return right({ attachment })
  }
}
