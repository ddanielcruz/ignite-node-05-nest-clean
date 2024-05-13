import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'

import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAttachment } from './upload-attachment'

let sut: UploadAttachment
let attachmentsRepo: InMemoryAttachmentsRepository
let uploader: FakeUploader

describe('UploadAttachment', () => {
  beforeEach(() => {
    attachmentsRepo = new InMemoryAttachmentsRepository()
    uploader = new FakeUploader()
    sut = new UploadAttachment(attachmentsRepo, uploader)
  })

  it('should be able to upload an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight())
    expect(result.value).toEqual({ attachment: attachmentsRepo.attachments[0] })
    expect(uploader.uploads).toHaveLength(1)
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.gif',
      fileType: 'image/gif',
      body: Buffer.from(''),
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
