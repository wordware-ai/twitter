export class HttpError extends Error {
  code: number

  constructor(message: string, name: string, code: number) {
    super(message)
    this.code = code
  }
}

export class HttpBadRequest extends HttpError {
  constructor(message: string) {
    super(message, 'BadRequest', 400)
  }
}

export class HttpForbidden extends HttpError {
  constructor(message: string) {
    super(message, 'Forbidden', 403)
  }
}

export class HttpNotFound extends HttpError {
  constructor(message: string) {
    super(message, 'NotFound', 404)
  }
}

export class HttpInternalServerError extends HttpError {
  constructor(message: string) {
    super(message, 'Internal Server Error', 500)
  }
}

export class HttpConflict extends HttpError {
  constructor(message: string) {
    super(message, 'Conflict', 409)
  }
}
