import { Router } from 'express'
import db from '../db/index.js'

const router = Router()

// роуты

// GET / — получение всех пользователей
router.get('/', async (req, res, next) => {
    try {
      // инициализируем БД
      await db.read()
   
      if (db.data.length) {
        // отправляем данные клиенту
        res.status(200).json(db.data)
      } else {
        // сообщаем об отсутствии
        res.status(200).json({ message: 'There are no user.' })
      }
    } catch (e) {
      // фиксируем локацию возникновения ошибки
      console.log('*** Get all users')
      // передаем ошибку обработчику ошибок
      next(e)
    }
   })

//  GET /:id — получение определенного пользователя по его идентификатору
router.get('/:id', async (req, res, next) => {
// извлекаем id из параметров запроса
const id = req.params.id

try {
    await db.read()

    if (!db.data.length) {
    return res.status(400).json({ message: 'There are no users' })
    }

    // ищем пользователя с указанным id
    const user = db.data.find((t) => t.id === id)

    // если не нашли
    if (!user) {
    return res
        .status(400)
        .json({ message: 'There is no user with provided ID' })
    }

    // если нашли
    res.status(200).json(user)
} catch (e) {
    console.log('*** Get user by ID')
    next(e)
}
})

// POST / — создание нового пользователя
router.post('/', async (req, res, next) => {
    // извлекаем текст из тела запроса
    const name = req.body.name
    const email = req.body.email
    const phone = req.body.phone
   
    if (!name) {
      return res.status(400).json({ message: 'New user name must be provided' })
    }
    else if (!email) {
      return res.status(400).json({ message: 'New user email must be provided' })
    }
    else if (!phone) {
      return res.status(400).json({ message: 'New user phone must be provided' })
    }
   
    try {
      await db.read()
   
      // создаем нового пользователя
      const newUser = {
        id: String(db.data.length + 1),
        name, email, phone
      }
   
      // помещаем его в массив
      db.data.push(newUser)
      // фиксируем изменения
      await db.write()
   
      // возвращаем обновленный массив
      res.status(201).json(db.data)
    } catch (e) {
      console.log('*** Create user')
      next(e)
    }
   })

//  PUT /:id — обновление определенного пользователя по его идентификатору
router.put('/:id', async (req, res, next) => {
// извлекаем id из параметров запроса
  const id = req.params.id;

  if (!id) {
    return res
      .status(400)
      .json({ message: 'Existing user ID must be provided' });
  }

  // извлекаем изменения из тела запроса
  const changes = req.body;

  if (!changes) {
    return res.status(400).json({ message: 'Changes must be provided' });
  }

  try {
    await db.read();

    // ищем пользователя
    const user = db.data.find((t) => t.id === id);

    // если не нашли
    if (!user) {
      return res
        .status(400)
        .json({ message: 'There is no user with the provided ID' });
    }

    // обновляем пользователя
    const updatedUser = { ...user, ...changes };

    // обновляем массив
    const newUsers = db.data.map((t) => (t.id === id ? updatedUser : t));

    // перезаписываем массив
    db.data = newUsers;
    // фиксируем изменения
    await db.write();

    res.status(200).json(db.data);
  } catch (e) {
    console.log('*** Update user');
    next(e);
  }
})

// DELETE /:id — удаление определенного пользователя по его идентификатору
router.delete('/:id', async (req, res, next) => {
// извлекаем id из параметров запроса
const id = req.params.id

if (!id) {
    return res
    .status(400)
    .json({ message: 'Existing user ID must be provided' })
}

try {
    await db.read()

    const user = db.data.find((t) => t.id === id)

    if (!user) {
    return res
        .status(400)
        .json({ message: 'There is no user with provided ID' })
    }

    // фильтруем массив
    const newUsers = db.data.filter((t) => t.id !== id)

    db.data = newUsers

    await db.write()

    res.status(201).json(db.data)
} catch (e) {
    console.log('*** Remove user')
    next(e)
}
})

export default router