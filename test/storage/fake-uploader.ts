import {
  Uploader,
  UploadObject,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<UploadObject> {
    const url = `https://storage.example.com/${Date.now()}-${fileName}`
    this.uploads.push({ fileName, url })

    return { url }
  }
}
