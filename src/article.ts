/**
 * check ${str} is not blank
 * @param str strings that need to check
 * @returns checked result
 */
export function notBlank(str?: string) {
  return str && str.trim() !== ''
}

/**
 * append prefix to `str` string
 * @param str main string
 * @param prefix prefix content string
 * @returns prefix + str，if str is blank, return a undefined
 */
export function appendStrPrefix(str?: string, prefix = '') {
  return notBlank(str) ? prefix + str : undefined
}
