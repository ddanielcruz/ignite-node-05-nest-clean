export abstract class ValueObject<TProps = unknown> {
  protected props: TProps

  constructor(props: TProps) {
    this.props = props
  }

  public equals(vo: unknown): vo is ValueObject<TProps> {
    if (!(vo instanceof ValueObject)) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
