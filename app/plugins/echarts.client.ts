import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Register ECharts components globally
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent,
  CanvasRenderer
])

export default defineNuxtPlugin(() => {
  return {
    provide: {
      echarts
    }
  }
})