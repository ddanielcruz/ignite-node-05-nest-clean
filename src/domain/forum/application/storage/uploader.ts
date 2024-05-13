export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export interface UploadObject {
  url: string
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<UploadObject>
}
