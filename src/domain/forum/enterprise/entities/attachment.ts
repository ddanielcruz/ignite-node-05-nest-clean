import { Entity } from '@/core/entities/entity'

interface AttachmentProps {
  title: string
  url: string
}

export class Attachment extends Entity<AttachmentProps> {
  get title(): string {
    return this.props.title
  }

  get url(): string {
    return this.props.url
  }
}
