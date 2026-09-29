import { del, get, list, put } from '@vercel/blob'

export const blobStorageEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)

export async function listPrivateFiles(prefix: string) {
  const result = await list({ prefix })
  return result.blobs.map((blob) => ({
    name: blob.pathname.slice(prefix.length),
    size: blob.size,
    uploadedAt: new Date(blob.uploadedAt).toISOString(),
  }))
}

export async function uploadPrivateFile(pathname: string, file: File) {
  return put(pathname, file, { access: 'private', addRandomSuffix: false })
}

export async function getPrivateFile(pathname: string) {
  return get(pathname, { access: 'private' })
}

export async function deletePrivateFile(pathname: string) {
  return del(pathname)
}
