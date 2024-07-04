import * as yup from 'yup'

let userSchema = yup.object({
  username: yup.string().required().min(3),
  email: yup.string().email().required(),
  password: yup.string().required(),
  role: yup.string().required(),
})

export default userSchema
