import copy from 'copy';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rm, rmSync } from 'fs'
import { glob } from 'glob';
import globby from 'globby';
import mkdirp from 'mkdirp';
import { dirname, join } from 'path'
import { sync as pkgUpSync } from 'pkg-up'

async function main() {
  const [path] = process.argv.slice(2);
  
  const localPackageJSON = JSON.parse(readFileSync(join(path, 'package.json'), 'utf8'))
  console.log(`Replacing local installation of ${localPackageJSON.name}`)

  const resolved = require.resolve(localPackageJSON.name, { paths: [process.cwd()]})
  const localInstall = dirname(pkgUpSync({ cwd: resolved })!)
  console.log(`Installed locally in ${localInstall}`)

  clearLocal(localInstall)

  const files = [
    ...(localPackageJSON.files ?? []),
    'package.json',
    '!node_modules',
    '!.gitignore',
    '!.git',
    '!.DS_STORE'
  ]

  const toCopy = await globby(files, {
    cwd: path,
  })

  for(const file of toCopy) {
    const src = join(path, file)
    const dest = join(localInstall, file)
    await mkdirp(dirname(dest))
    copyFileSync(src, dest)
  }

  console.log(`Copied ${toCopy.length} files`)
}

main()

function clearLocal(path: string) {
  for(const entry of readdirSync(path)) {
    if(path === 'node_modules') {
      continue;
    }
    rmSync(join(path, entry), { recursive: true })
  }
}