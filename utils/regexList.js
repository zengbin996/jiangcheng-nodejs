const list = [
  {
    label: 'password',
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
]

const getter = (label) => {
  const current = list.find((a) => (a.label = label))
  return current && current.value
}

module.exports = getter
