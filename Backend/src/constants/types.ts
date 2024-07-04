export const TYPES = {
  // Controllers
  UserController: Symbol.for('UserController'),
  EventController: Symbol.for('EventController'),

  // Services
  UserService: Symbol.for('UserService'),
  EventService: Symbol.for('EventService'),

  // Middlewares
  AuthMiddleware: Symbol.for('AuthMiddleware'),
}
