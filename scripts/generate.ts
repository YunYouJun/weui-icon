import path from 'node:path'
import fs from 'fs-extra'
import glob from 'fast-glob'

import { SVG, blankIconSet, deOptimisePaths, exportJSONPackage, parseColors, runSVGO } from '@iconify/tools'
import { compareColors, stringToColor } from '@iconify/utils/lib/colors'

import { pascalCase } from 'scule'

import consola from 'consola'
import chalk from 'chalk'

const __dirname = import.meta.dirname
const weuiIconAssetsFolder = path.resolve(__dirname, '../src/assets')

const iconifyFolder = path.resolve(__dirname, '../packages/iconify')
const svgFolder = path.resolve(__dirname, '../packages/svg')
const vueComponentsFolder = path.resolve(__dirname, '../packages/vue/components')

async function generate() {
  const filledAssets = await glob(path.join(weuiIconAssetsFolder, 'filled/*.svg'))
  const outlinedAssets = await glob(path.join(weuiIconAssetsFolder, 'outlined/*.svg'))

  const iconsMap: Record<string, string[]> = {
    filled: filledAssets,
    outlined: outlinedAssets,
  }

  await fs.emptyDir(svgFolder)
  await fs.emptyDir(vueComponentsFolder)

  // Generate Iconify JSON
  const iconSet = blankIconSet('weui')

  for (const [suffix, assets] of Object.entries(iconsMap)) {
    for (const asset of assets) {
      const icon = await fs.readFile(asset, 'utf-8')
      const svg = new SVG(icon)
      // not enough
      // @see https://iconify.design/docs/libraries/tools/icon/#runsvgo
      // cleanupSVG(svg)

      // TODO: seperate filled and outlined icons
      const iconName = `${path.basename(asset, '.svg')}-${suffix}`
      await fs.writeFile(path.join(svgFolder, `${iconName}.svg`), svg.toMinifiedString())

      await fs.writeFile(path.join(vueComponentsFolder, `Icon${pascalCase(iconName)}.vue`), `<template>
  ${svg.toMinifiedString()}
</template>`)

      // Change color to `currentColor`
      const blackColor = stringToColor('black')!

      parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (attr, colorStr, color) => {
          // console.log('Color:', colorStr, color);

          // Change black to 'currentColor'
          if (color && compareColors(color, blackColor))
            return 'currentColor'

          switch (color?.type) {
            case 'none':
            case 'current':
              return color
          }

          throw new Error(
								`Unexpected color "${colorStr}" in attribute ${attr}`,
          )
        },
      })

      // Optimise
      runSVGO(svg)
      // Update paths for compatibility with old software
      deOptimisePaths(svg)

      iconSet.fromSVG(iconName, svg)
    }
  }
  consola.success('Generate SVGs successfully!')

  await fs.writeJson(path.join(iconifyFolder, 'weui-icons.json'), iconSet.export(), { spaces: 2 })

  const target = `packages/iconify`
  // Export package
  consola.info('Exporting iconify package to', chalk.yellow(target), '...')
  await exportJSONPackage(iconSet, {
    target,
    package: {
      // todo
      // name: `@iconify-json/${iconSet.prefix}`,

      version: '1.0.0',
      homepage: 'https://icon-sets.iconify.design/weui/',
      bugs: 'https://github.com/iconify/icon-sets/issues',
    },
    cleanup: true,
    /*
    customFiles: {
        'README.md': 'README!',
    },
    */
  })
  consola.success('Generated iconify package successfully!')
}

generate()
