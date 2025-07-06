export const userColumnsAndWith = {
  columns: {
    passwordHash: false,
    personId: true,
  },
  with: {
    person: {
      columns: {
        registrationDate: false,
        updateDate: false,
      },
    },
  },
}
