export const userColumnsAndWith = {
  columns: {
    passwordHash: false,
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
