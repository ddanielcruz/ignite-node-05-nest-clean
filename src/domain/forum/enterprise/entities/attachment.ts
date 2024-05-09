import { Entity } from '@/core/entities/entity'

interface AttachmentProps {
  title: string
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  get title(): string {
    return this.props.title
  }

  get link(): string {
    return this.props.link
  }
}
