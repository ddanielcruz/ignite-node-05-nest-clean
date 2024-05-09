export class Left<TValue> {
  constructor(public readonly value: TValue) {}

  isRight(): this is Right<never> {
    return false
  }

  isLeft(): this is Left<TValue> {
    return true
  }
}

export class Right<TValue> {
  constructor(public readonly value: TValue) {}

  isRight(): this is Right<TValue> {
    return true
  }

  isLeft(): this is Left<never> {
    return false
  }
}

export type Either<TLeft = unknown, TRight = unknown> =
  | Left<TLeft>
  | Right<TRight>

export const left = <TLeft>(value: TLeft): Either<TLeft, never> =>
  new Left(value)

export const right = <TRight>(value: TRight): Either<never, TRight> =>
  new Right(value)
