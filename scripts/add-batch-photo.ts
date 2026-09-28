/**
 * Add photos to a batch's gallery.
 *
 * Resizes to 1600px on the long edge at ~80% JPEG quality, strips all
 * metadata (phone photos carry GPS coordinates), saves the result under
 * public/images/batches/<batchNo>/, and appends it to that batch's `images`
 * in data/batches.ts. Accepts anything `sips` can read, including HEIC.
 * Requires macOS (sips) and ffmpeg (`brew install ffmpeg`).
 *
 * Usage:
 *   npm run add-photo -- <batchNo> <image> [--caption "text"]
 *   npm run add-photo -- <batchNo> <image> <image> ...
 */

import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { execFileSync } from 'child_process'
import type { Batch, BatchImage } from '../types'

function usage(message?: string): never {
  if (message) console.error(`Error: ${message}\n`)
  console.error(
    'Usage: npm run add-photo -- <batchNo> <image...> [--caption "text"]\n' +
      '       (--caption only applies when adding a single image)'
  )
  process.exit(1)
}

function requireTool(cmd: string, hint: string) {
  try {
    execFileSync('which', [cmd], { stdio: 'ignore' })
  } catch {
    usage(`${cmd} not found. ${hint}`)
  }
}

function parseArgs(argv: string[]) {
  const args = [...argv]
  let caption: string | undefined
  const captionIdx = args.indexOf('--caption')
  if (captionIdx !== -1) {
    caption = args[captionIdx + 1]
    if (!caption) usage('--caption needs a value')
    args.splice(captionIdx, 2)
  }
  const [batchArg, ...images] = args
  const batchNo = Number(batchArg)
  if (!Number.isInteger(batchNo) || batchNo <= 0) {
    usage('first argument must be a batch number')
  }
  if (images.length === 0) usage('no images given')
  if (caption && images.length > 1) {
    usage('--caption only works with a single image')
  }
  for (const img of images) {
    if (!fs.existsSync(img)) usage(`file not found: ${img}`)
  }
  return { batchNo, images, caption }
}

// Next free NN.jpg in the batch's folder
function nextIndex(dir: string): number {
  if (!fs.existsSync(dir)) return 1
  const taken = fs
    .readdirSync(dir)
    .map((f) => f.match(/^(\d+)\.jpg$/)?.[1])
    .filter((n): n is string => !!n)
    .map(Number)
  return taken.length > 0 ? Math.max(...taken) + 1 : 1
}

function optimize(input: string, output: string) {
  const tmp = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'batch-photo-')),
    'resized.jpg'
  )
  execFileSync(
    'sips',
    [
      '-Z',
      '1600',
      '-s',
      'format',
      'jpeg',
      '-s',
      'formatOptions',
      '80',
      input,
      '--out',
      tmp,
    ],
    { stdio: 'ignore' }
  )
  execFileSync(
    'ffmpeg',
    [
      '-loglevel',
      'error',
      '-y',
      '-i',
      tmp,
      '-map_metadata',
      '-1',
      '-q:v',
      '3',
      output,
    ],
    { stdio: 'inherit' }
  )
  fs.rmSync(path.dirname(tmp), { recursive: true, force: true })
}

async function main() {
  const { batchNo, images, caption } = parseArgs(process.argv.slice(2))
  requireTool('sips', 'This script needs macOS.')
  requireTool('ffmpeg', 'Install it with `brew install ffmpeg`.')

  const { batches } = (await import('../data/batches.js')) as {
    batches: Batch[]
  }
  const batch = batches.find((b) => b.batchNo === batchNo)
  if (!batch) usage(`no batch #${batchNo} in data/batches.ts`)

  const dir = path.join(process.cwd(), 'public/images/batches', `${batchNo}`)
  fs.mkdirSync(dir, { recursive: true })

  let index = nextIndex(dir)
  const added: BatchImage[] = []
  for (const img of images) {
    const file = `${String(index).padStart(2, '0')}.jpg`
    optimize(img, path.join(dir, file))
    const src = `/images/batches/${batchNo}/${file}`
    added.push(caption ? { src, caption } : { src })
    console.log(`${img} → public${src}`)
    index++
  }
  batch.images = [...(batch.images ?? []), ...added]

  // Same serialization as scripts/sync-brewfather.ts, so the next sync
  // doesn't produce a spurious diff
  const content = `import { Batch } from '@/types'

export const batches: Batch[] = ${JSON.stringify(batches, null, 2)}
`
  const dataFile = path.join(process.cwd(), 'data/batches.ts')
  fs.writeFileSync(dataFile, content)
  execFileSync('npx', ['prettier', '--write', dataFile], { stdio: 'ignore' })
  console.log(
    `Added ${added.length} photo${added.length === 1 ? '' : 's'} to batch #${batchNo} "${batch.name}".`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
