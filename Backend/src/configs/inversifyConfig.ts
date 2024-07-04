import { Container } from 'inversify'
import { AuthMiddleware } from '../middlewares'
import { TYPES } from '../constants'
import { EventService, UserService } from '../services'
import { UserController } from '../controllers'
import { EventController } from '../controllers/eventController'

const container = new Container()

container.bind<UserController>(TYPES.UserController).to(UserController)
container.bind<EventController>(TYPES.EventController).to(EventController)

container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<EventService>(TYPES.EventService).to(EventService)

container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware)

export default container
