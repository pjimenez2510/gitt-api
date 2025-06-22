import { notificationTemplate } from 'drizzle/schema/tables/notifications/notificationTemplate'

export const notificationsTemplateSeed: (typeof notificationTemplate.$inferInsert)[] =
  [
    {
      type: 'LOAN',
      templateTitle: '📋 Préstamo registrado: {{ equipment }}',
      templateContent: `
  Hola {{ userName }},
  
  Tu solicitud de préstamo ha sido registrada con éxito en el sistema de la UTA.
  
  📦 Ítem: {{ equipment }}  
  📅 Fecha de devolución: {{ dueDate }}  
  
  Por favor, asegúrate de devolver el ítem en buen estado y dentro del plazo establecido.
  
  Gracias,  
  Equipo de Préstamos UTA
        `.trim(),
    },
    {
      type: 'RETURN',
      templateTitle: '⏳ Recuerda devolver tu préstamo: {{ equipment }}',
      templateContent: `
  Hola {{ userName }},
  
  Este es un recordatorio de que se aproxima la fecha límite para devolver el siguiente préstamo:
  
  📦 Ítem: {{ equipment }}  
  📅 Fecha de devolución: {{ dueDate }}  
  ⏱ Tiempo restante: {{ daysRemaining }} días
  
  Por favor, asegúrate de devolver el equipo a tiempo para evitar penalizaciones.
  
  Saludos,  
  Sistema de Préstamos UTA
        `.trim(),
    },
    {
      type: 'EXPIRATION',
      templateTitle: '❗ Préstamo vencido: {{ equipment }} – Acción requerida',
      templateContent: `
  Hola {{ userName }},
  
  El siguiente préstamo ha superado su fecha límite de devolución:
  
  📦 Ítem: {{ equipment }}  
  📅 Fecha límite: {{ dueDate }}  
  📆 Días de retraso: {{ overdueDays }}
  
  Por favor, devuelve el equipo lo antes posible o comunícate con el área responsable.
  
  ⚠️ Los retrasos pueden generar penalizaciones.
  
  Gracias,  
  Sistema de Préstamos UTA
        `.trim(),
    },
  ]
