import Alert from 'react-bootstrap/Alert'
import {
  useNotificationDispatch,
  useNotificationValue,
} from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()
  const notificationDispatch = useNotificationDispatch()

  const getHeading = () => {
    return !notification?.message ? null : (
      <Alert.Heading>{notification.message}</Alert.Heading>
    )
  }

  const getMessages = () => {
    if (!notification?.messages?.length) return null

    return (
      <ul className='mb-0'>
        {notification.messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    )
  }

  return (
    <Alert
      id='notification'
      variant={notification?.type}
      show={notification?.show || false}
      dismissible
      className='notification fixed-top w-auto m-3'
      onClose={() => notificationDispatch()}
    >
      {getHeading()}
      {getMessages()}
    </Alert>
  )
}

export default Notification
