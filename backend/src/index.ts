import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify, decode } from 'hono/jwt'

const app = new Hono<{
  Bindings : {
    DATABASE_URL : string
    JWT_SECRET : string
  }
}>()
  

app.post('/api/v1/user/signup', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL
}).$extends(withAccelerate())

  const body = await c.req.json()
  // Add password hashing later

  try {
    const user = await prisma.user.create({
      data : {
        email : body.email,
        password : body.password,
        name : body.name
      }
    })

    const token = await sign({
      id : user.id
    }, c.env.JWT_SECRET)
  return c.json({
    jwt : token
  })
    
  } catch (error) {
    c.status(400)
    console.log(error)
    return c.json({
      msg : error
    })
  }
})



app.post('/api/v1/user/signin',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

  const body = await c.req.json()

  try {
    const user = await prisma.user.findUnique({
      where :{
        email : body.email,
        password : body.password
      }
    })

    const token = await sign({id : user?.id}, c.env.JWT_SECRET)
    console.log(token)
    return c.json({jwt : token})
  } catch (error) {
    c.status(403);
		return c.json({ error: "user not found" });
  }


})
app.post('/api/v1/blog', (c) => {
  return c.json({
    msg : "blog endpoint"
  })
})
app.put('/api/v1/blog', (c) => {
  return c.json({
    msg : "blog endpoint"
  })
})
app.get('/api/v1/blog/:id', (c) => {
  return c.json({
    msg : "get blog endpoint"
  })
})
app.get('/api/v1/blog/bulk', (c) => {
  return c.json({
    msg : "get bulk blog endpoint"
  })
})





export default app
