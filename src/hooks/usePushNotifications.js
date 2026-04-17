import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { supabase } from '../api/supabase'

export function usePushNotifications(userId) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !userId) return

    let regListener, errListener, receivedListener, actionListener

    PushNotifications.requestPermissions().then(({ receive }) => {
      if (receive === 'granted') PushNotifications.register()
    })

    regListener = PushNotifications.addListener('registration', async ({ value }) => {
      await supabase.from('devices').upsert({
        user_id: userId,
        platform: 'android',
        fcm_token: value,
        last_seen_at: new Date().toISOString(),
      })
    })

    errListener = PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error', err)
    })

    receivedListener = PushNotifications.addListener('pushNotificationReceived', (notif) => {
      console.log('Push received (foreground)', notif)
    })

    actionListener = PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push tapped', action)
    })

    return () => {
      regListener?.remove()
      errListener?.remove()
      receivedListener?.remove()
      actionListener?.remove()
    }
  }, [userId])
}
