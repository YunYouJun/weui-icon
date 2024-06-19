import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import weuiIcons from '../packages/iconify/icons.json'

const safelist: string[] = []

// only use it when dynamic class name
Object.keys(weuiIcons.icons).forEach((icon) => {
  safelist.push(`i-weui:${icon}`)
  safelist.push(`i-weui-${icon}`)
})

export default defineConfig({
  shortcuts: [],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: 'inline-flex',
      },
      scale: 1.2,
      collections: {
        weui: () => weuiIcons,
      },
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist,
})
