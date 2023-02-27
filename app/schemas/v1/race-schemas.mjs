import { authSchema } from './header-auth-schema.mjs'

const addRaceSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: ['raceName', 'date', 'city', 'state', 'promoterId'],
    properties: {
      raceName: {
        type: 'string'
      },
      raceUrl: {
        type: 'string'
      },
      date: {
        type: 'number'
      },
      city: {
        type: 'string'
      },
      state: {
        type: 'string'
      },
      promoterId: {
        type: 'string'
      }
    },
    additionalProperties: false
  }
}

const changeGoingSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: ['raceId', 'action'],
    properties: {
      raceId: {
        type: 'string'
      },
      action: {
        type: 'string'
      }
    }
  }
}

const changeInterestedSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: ['raceId', 'action'],
    properties: {
      raceId: {
        type: 'string'
      },
      action: {
        type: 'string'
      }
    }
  }
}

const discardRaceSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string'
      }
    },
    additionalProperties: false
  }
}

const readAllRacesSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string'
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'string'
              },
              raceName: {
                type: 'string'
              },
              raceUrl: {
                type: 'string'
              },
              date: {
                type: 'string'
              },
              city: {
                type: 'string'
              },
              state: {
                type: 'string'
              },
              creatorId: {
                type: 'string'
              },
              ownerId: {
                type: 'string'
              },
              createdAt: {
                type: 'string'
              },
              updatedAt: {
                type: 'string'
              },
              promoterNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    promoterName: {
                      type: 'string'
                    },
                    promoterUrl: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const readAllRacesParticipantsSchema = {
  headers: authSchema,
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string'
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'string'
              },
              raceName: {
                type: 'string'
              },
              raceUrl: {
                type: 'string'
              },
              date: {
                type: 'string'
              },
              city: {
                type: 'string'
              },
              state: {
                type: 'string'
              },
              creatorId: {
                type: 'string'
              },
              ownerId: {
                type: 'string'
              },
              createdAt: {
                type: 'string'
              },
              updatedAt: {
                type: 'string'
              },
              interestedNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    firstName: {
                      type: 'string'
                    },
                    lastName: {
                      type: 'string'
                    }
                  }
                }
              },
              goingNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    firstName: {
                      type: 'string'
                    },
                    lastName: {
                      type: 'string'
                    }
                  }
                }
              },
              promoterNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    promoterName: {
                      type: 'string'
                    },
                    promoterUrl: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const readRaceGoingByRaceIdSchema = {
  headers: authSchema,
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string'
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'string'
              },
              goingNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    firstName: {
                      type: 'string'
                    },
                    lastName: {
                      type: 'string'
                    },
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const readRaceInterestedByRaceIdSchema = {
  headers: authSchema,
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string'
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'string'
              },
              interestedNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    firstName: {
                      type: 'string'
                    },
                    lastName: {
                      type: 'string'
                    },
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const readRacesUpcomingSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string'
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'string'
              },
              raceName: {
                type: 'string'
              },
              raceUrl: {
                type: 'string'
              },
              date: {
                type: 'string'
              },
              city: {
                type: 'string'
              },
              state: {
                type: 'string'
              },
              creatorId: {
                type: 'string'
              },
              ownerId: {
                type: 'string'
              },
              createdAt: {
                type: 'string'
              },
              updatedAt: {
                type: 'string'
              },
              promoterNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    promoterName: {
                      type: 'string'
                    },
                    promoterUrl: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const readRacesUpcomingParticipantsSchema = {
  headers: authSchema,
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string'
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'string'
              },
              raceName: {
                type: 'string'
              },
              raceUrl: {
                type: 'string'
              },
              date: {
                type: 'string'
              },
              city: {
                type: 'string'
              },
              state: {
                type: 'string'
              },
              creatorId: {
                type: 'string'
              },
              ownerId: {
                type: 'string'
              },
              createdAt: {
                type: 'string'
              },
              updatedAt: {
                type: 'string'
              },
              interestedNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    firstName: {
                      type: 'string'
                    },
                    lastName: {
                      type: 'string'
                    }
                  }
                }
              },
              goingNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    firstName: {
                      type: 'string'
                    },
                    lastName: {
                      type: 'string'
                    }
                  }
                }
              },
              promoterNames: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string'
                    },
                    promoterName: {
                      type: 'string'
                    },
                    promoterUrl: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export {
  addRaceSchema,
  changeGoingSchema,
  changeInterestedSchema,
  discardRaceSchema,
  readAllRacesSchema,
  readAllRacesParticipantsSchema,
  readRaceGoingByRaceIdSchema,
  readRaceInterestedByRaceIdSchema,
  readRacesUpcomingSchema,
  readRacesUpcomingParticipantsSchema
}
