import 'server-only'
import sizeOf from 'image-size'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'
import { ImageProps, default as NextImage } from 'next/image'
import { getPlaiceholder } from 'plaiceholder'
import { readFile } from 'node:fs/promises'
import { IncomingMessage } from 'node:http'
import https from 'node:https'
import path from 'node:path'

// https://github.com/image-size/image-size/issues/258
const getStreamImageSize = async (stream: IncomingMessage) => {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
    try {
      const buf = Buffer.concat(chunks)
      // stop requesting data after dimensions are known
      const size = sizeOf(buf)
      // if we have enough data for size, we have enough to blur, important that this is called after to not repeat network requests
      const { base64 } = await getPlaiceholder(buf)
      return { size, base64 }
    } catch (error) {
      // Not enough buffer to determine sizes yet
    }
  }
}

const fetchImageSizeFromUrl = async (imageUrl: string) => {
  // Not sure if this is the best way to do it, but it works so ...
  try {
    const res = await new Promise<{
      size: ISizeCalculationResult
      base64: string
    }>((resolve, reject) =>
      https
        .get(imageUrl, async (stream) => {
          const res = await getStreamImageSize(stream)
          if (res?.size && res.base64) {
            resolve({
              size: res.size,
              base64: res.base64,
            })
          } else {
            reject({
              reason: `Error while resolving external image size with src: ${imageUrl}`,
            })
          }
        })
        .on('error', (e) => {
          reject({ reason: e })
        })
    )

    return res
  } catch (error) {
    console.error(error)
  }
}

const fetchImageInfoFromFile = async (imagePath: string) => {
  try {
    const img = await readFile(imagePath)
    const { base64 } = await getPlaiceholder(img)
    return { size: sizeOf(img), base64 }
  } catch (error) {
    console.error(`Error while reading image with path: ${imagePath}`)
    console.error(error)
  }
}

export const ServerImage = async ({
  src,
  quality = 60,
  ...restProps
}: Omit<ImageProps, 'src'> & { src: string }) => {
  if (!src) return null
  const isExternalImage = src.startsWith('https')
  const isPublicImage = src.startsWith('/')
  const alt = restProps.alt || ''

  const imgProps = { ...restProps, src, quality, alt }
  let Img: typeof NextImage | string = 'img'

  let size: ISizeCalculationResult | undefined
  let base64: string | undefined

  if (isPublicImage) {
    const res = await fetchImageInfoFromFile(path.join('public', src))
    size = res?.size
    base64 = res?.base64
  }

  if (isExternalImage) {
    const res = await fetchImageSizeFromUrl(src)
    size = res?.size
    base64 = res?.base64
  }

  if (size) {
    const { width, height } = size
    imgProps.width = width
    imgProps.height = height
    Img = NextImage
  }

  if (base64) {
    imgProps.blurDataURL = base64
  }

  return <Img placeholder={'blur'} {...imgProps} />
}
