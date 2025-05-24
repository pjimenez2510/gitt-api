export const certificateColumnsAndWith = {
  columns: {
    registrationDate: false,
    updateDate: false,
    deliveryResponsibleId: false,
    receptionResponsibleId: false,
  },
  with: {
    deliveryResponsible: {
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        registrationDate: false,
        updateDate: false,
        active: false,
      },
    },
    receptionResponsible: {
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        registrationDate: false,
        updateDate: false,
        active: false,
      },
    },
  },
}
