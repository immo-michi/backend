export const numberExtractor = (any: string): number => {
  let value: any

  if (any.includes('-')) {
    value = any.split('-').pop()
  } else {
    value = any
  }

  value = value.replace(/[,.](\d\d)$/ig, 'D$1')
  value = value.replace(/[^\dD]/ig, '')
  value = value.replace(/[D]/ig, '.')

  value = Number(value)

  if (isNaN(value)) {
    return 0
  }

  return value
}
