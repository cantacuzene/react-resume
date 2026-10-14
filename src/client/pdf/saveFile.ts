// The one DOM side effect of the PDF feature: hand the blob to the browser as a download
export const saveFile = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.setAttribute('href', url)
  anchor.setAttribute('download', fileName)
  anchor.click()
  URL.revokeObjectURL(url)
}
