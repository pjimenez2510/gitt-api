export const itemColumnsAndWith = {
  columns: {
    registrationDate: false,
    updateDate: false,
    itemTypeId: false,
    statusId: false,
    conditionId: false,
    locationId: false,
    certificateId: false,
    categoryId: false,
  },
  with: {
    certificate: {
      columns: {
        id: true,
        number: true,
        date: true,
        type: true,
        status: true,
        accounted: true,
      },
    },
    colors: {
      columns: {
        id: true,
        isMainColor: true,
      },
      with: {
        color: {
          columns: {
            id: true,
            name: true,
            hexCode: true,
          },
        },
      },
    },
    itemType: {
      columns: {
        id: true,
        code: true,
        name: true,
        description: true,
      },
    },
    materials: {
      columns: {
        id: true,
        isMainMaterial: true,
      },
      with: {
        material: {
          columns: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    },
    status: {
      columns: {
        id: true,
        name: true,
        description: true,
      },
    },
    condition: {
      columns: {
        id: true,
        name: true,
        description: true,
      },
    },
    location: {
      columns: {
        id: true,
        name: true,
        description: true,
      },
      with: {
        warehouse: {
          columns: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    },
    category: {
      columns: {
        id: true,
        name: true,
        description: true,
      },
    },
  },
}
