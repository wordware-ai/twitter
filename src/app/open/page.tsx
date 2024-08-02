'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartData = [
  {
    timestamp: '2024-07-29T05:00:00',
    unique_users_count: 13,
    cumulative_unique_users_count: 13,
  },
  {
    timestamp: '2024-07-29T06:00:00',
    unique_users_count: 5,
    cumulative_unique_users_count: 18,
  },
  {
    timestamp: '2024-07-29T07:00:00',
    unique_users_count: 23,
    cumulative_unique_users_count: 41,
  },
  {
    timestamp: '2024-07-29T08:00:00',
    unique_users_count: 17,
    cumulative_unique_users_count: 58,
  },
  {
    timestamp: '2024-07-29T09:00:00',
    unique_users_count: 66,
    cumulative_unique_users_count: 124,
  },
  {
    timestamp: '2024-07-29T10:00:00',
    unique_users_count: 23,
    cumulative_unique_users_count: 147,
  },
  {
    timestamp: '2024-07-29T11:00:00',
    unique_users_count: 18,
    cumulative_unique_users_count: 165,
  },
  {
    timestamp: '2024-07-29T12:00:00',
    unique_users_count: 24,
    cumulative_unique_users_count: 189,
  },
  {
    timestamp: '2024-07-29T13:00:00',
    unique_users_count: 24,
    cumulative_unique_users_count: 213,
  },
  {
    timestamp: '2024-07-29T14:00:00',
    unique_users_count: 21,
    cumulative_unique_users_count: 234,
  },
  {
    timestamp: '2024-07-29T15:00:00',
    unique_users_count: 17,
    cumulative_unique_users_count: 251,
  },
  {
    timestamp: '2024-07-29T16:00:00',
    unique_users_count: 54,
    cumulative_unique_users_count: 305,
  },
  {
    timestamp: '2024-07-29T17:00:00',
    unique_users_count: 143,
    cumulative_unique_users_count: 448,
  },
  {
    timestamp: '2024-07-29T18:00:00',
    unique_users_count: 254,
    cumulative_unique_users_count: 702,
  },
  {
    timestamp: '2024-07-29T19:00:00',
    unique_users_count: 349,
    cumulative_unique_users_count: 1051,
  },
  {
    timestamp: '2024-07-29T20:00:00',
    unique_users_count: 326,
    cumulative_unique_users_count: 1377,
  },
  {
    timestamp: '2024-07-29T21:00:00',
    unique_users_count: 338,
    cumulative_unique_users_count: 1715,
  },
  {
    timestamp: '2024-07-29T22:00:00',
    unique_users_count: 321,
    cumulative_unique_users_count: 2036,
  },
  {
    timestamp: '2024-07-29T23:00:00',
    unique_users_count: 410,
    cumulative_unique_users_count: 2446,
  },
  {
    timestamp: '2024-07-30T00:00:00',
    unique_users_count: 432,
    cumulative_unique_users_count: 2878,
  },
  {
    timestamp: '2024-07-30T01:00:00',
    unique_users_count: 362,
    cumulative_unique_users_count: 3240,
  },
  {
    timestamp: '2024-07-30T02:00:00',
    unique_users_count: 732,
    cumulative_unique_users_count: 3972,
  },
  {
    timestamp: '2024-07-30T03:00:00',
    unique_users_count: 1065,
    cumulative_unique_users_count: 5037,
  },
  {
    timestamp: '2024-07-30T04:00:00',
    unique_users_count: 1765,
    cumulative_unique_users_count: 6802,
  },
  {
    timestamp: '2024-07-30T05:00:00',
    unique_users_count: 2033,
    cumulative_unique_users_count: 8835,
  },
  {
    timestamp: '2024-07-30T06:00:00',
    unique_users_count: 1787,
    cumulative_unique_users_count: 10622,
  },
  {
    timestamp: '2024-07-30T07:00:00',
    unique_users_count: 1787,
    cumulative_unique_users_count: 12409,
  },
  {
    timestamp: '2024-07-30T08:00:00',
    unique_users_count: 813,
    cumulative_unique_users_count: 13222,
  },
  {
    timestamp: '2024-07-30T10:00:00',
    unique_users_count: 773,
    cumulative_unique_users_count: 13995,
  },
  {
    timestamp: '2024-07-30T11:00:00',
    unique_users_count: 2015,
    cumulative_unique_users_count: 16010,
  },
  {
    timestamp: '2024-07-30T12:00:00',
    unique_users_count: 2619,
    cumulative_unique_users_count: 18629,
  },
  {
    timestamp: '2024-07-30T13:00:00',
    unique_users_count: 3579,
    cumulative_unique_users_count: 22208,
  },
  {
    timestamp: '2024-07-30T14:00:00',
    unique_users_count: 4017,
    cumulative_unique_users_count: 26225,
  },
  {
    timestamp: '2024-07-30T15:00:00',
    unique_users_count: 2533,
    cumulative_unique_users_count: 28758,
  },
  {
    timestamp: '2024-07-30T16:00:00',
    unique_users_count: 6026,
    cumulative_unique_users_count: 34784,
  },
  {
    timestamp: '2024-07-30T17:00:00',
    unique_users_count: 7586,
    cumulative_unique_users_count: 42370,
  },
  {
    timestamp: '2024-07-30T18:00:00',
    unique_users_count: 9532,
    cumulative_unique_users_count: 51902,
  },
  {
    timestamp: '2024-07-30T19:00:00',
    unique_users_count: 12048,
    cumulative_unique_users_count: 63950,
  },
  {
    timestamp: '2024-07-30T20:00:00',
    unique_users_count: 18469,
    cumulative_unique_users_count: 82419,
  },
  {
    timestamp: '2024-07-30T21:00:00',
    unique_users_count: 11055,
    cumulative_unique_users_count: 93474,
  },
  {
    timestamp: '2024-07-30T22:00:00',
    unique_users_count: 13615,
    cumulative_unique_users_count: 107089,
  },
  {
    timestamp: '2024-07-30T23:00:00',
    unique_users_count: 20834,
    cumulative_unique_users_count: 127923,
  },
  {
    timestamp: '2024-07-31T00:00:00',
    unique_users_count: 11167,
    cumulative_unique_users_count: 139090,
  },
  {
    timestamp: '2024-07-31T01:00:00',
    unique_users_count: 13818,
    cumulative_unique_users_count: 152908,
  },
  {
    timestamp: '2024-07-31T02:00:00',
    unique_users_count: 20058,
    cumulative_unique_users_count: 172966,
  },
  {
    timestamp: '2024-07-31T03:00:00',
    unique_users_count: 20467,
    cumulative_unique_users_count: 193433,
  },
  {
    timestamp: '2024-07-31T04:00:00',
    unique_users_count: 19132,
    cumulative_unique_users_count: 212565,
  },
  {
    timestamp: '2024-07-31T05:00:00',
    unique_users_count: 17551,
    cumulative_unique_users_count: 230116,
  },
  {
    timestamp: '2024-07-31T06:00:00',
    unique_users_count: 13056,
    cumulative_unique_users_count: 243172,
  },
  {
    timestamp: '2024-07-31T07:00:00',
    unique_users_count: 16352,
    cumulative_unique_users_count: 259524,
  },
  {
    timestamp: '2024-07-31T08:00:00',
    unique_users_count: 3476,
    cumulative_unique_users_count: 263000,
  },
  {
    timestamp: '2024-07-31T09:00:00',
    unique_users_count: 4333,
    cumulative_unique_users_count: 267333,
  },
  {
    timestamp: '2024-07-31T10:00:00',
    unique_users_count: 137,
    cumulative_unique_users_count: 267470,
  },
  {
    timestamp: '2024-07-31T11:00:00',
    unique_users_count: 16606,
    cumulative_unique_users_count: 284076,
  },
  {
    timestamp: '2024-07-31T12:00:00',
    unique_users_count: 13145,
    cumulative_unique_users_count: 297221,
  },
  {
    timestamp: '2024-07-31T13:00:00',
    unique_users_count: 9619,
    cumulative_unique_users_count: 306840,
  },
  {
    timestamp: '2024-07-31T18:00:00',
    unique_users_count: 8349,
    cumulative_unique_users_count: 315189,
  },
  {
    timestamp: '2024-07-31T19:00:00',
    unique_users_count: 12422,
    cumulative_unique_users_count: 327611,
  },
  {
    timestamp: '2024-07-31T20:00:00',
    unique_users_count: 7756,
    cumulative_unique_users_count: 335367,
  },
  {
    timestamp: '2024-07-31T21:00:00',
    unique_users_count: 496,
    cumulative_unique_users_count: 335863,
  },
  {
    timestamp: '2024-07-31T22:00:00',
    unique_users_count: 8267,
    cumulative_unique_users_count: 344130,
  },
  {
    timestamp: '2024-07-31T23:00:00',
    unique_users_count: 15639,
    cumulative_unique_users_count: 359769,
  },
  {
    timestamp: '2024-08-01T00:00:00',
    unique_users_count: 18092,
    cumulative_unique_users_count: 377861,
  },
  {
    timestamp: '2024-08-01T01:00:00',
    unique_users_count: 21037,
    cumulative_unique_users_count: 398898,
  },
  {
    timestamp: '2024-08-01T02:00:00',
    unique_users_count: 22890,
    cumulative_unique_users_count: 421788,
  },
  {
    timestamp: '2024-08-01T03:00:00',
    unique_users_count: 19569,
    cumulative_unique_users_count: 441357,
  },
  {
    timestamp: '2024-08-01T04:00:00',
    unique_users_count: 17506,
    cumulative_unique_users_count: 458863,
  },
  {
    timestamp: '2024-08-01T05:00:00',
    unique_users_count: 16140,
    cumulative_unique_users_count: 475003,
  },
  {
    timestamp: '2024-08-01T06:00:00',
    unique_users_count: 16644,
    cumulative_unique_users_count: 491647,
  },
  {
    timestamp: '2024-08-01T07:00:00',
    unique_users_count: 18006,
    cumulative_unique_users_count: 509653,
  },
  {
    timestamp: '2024-08-01T08:00:00',
    unique_users_count: 20971,
    cumulative_unique_users_count: 530624,
  },
  {
    timestamp: '2024-08-01T09:00:00',
    unique_users_count: 22903,
    cumulative_unique_users_count: 553527,
  },
  {
    timestamp: '2024-08-01T10:00:00',
    unique_users_count: 25505,
    cumulative_unique_users_count: 579032,
  },
  {
    timestamp: '2024-08-01T11:00:00',
    unique_users_count: 24284,
    cumulative_unique_users_count: 603316,
  },
  {
    timestamp: '2024-08-01T12:00:00',
    unique_users_count: 26941,
    cumulative_unique_users_count: 630257,
  },
  {
    timestamp: '2024-08-01T13:00:00',
    unique_users_count: 30040,
    cumulative_unique_users_count: 660297,
  },
  {
    timestamp: '2024-08-01T16:00:00',
    unique_users_count: 6031,
    cumulative_unique_users_count: 666328,
  },
  {
    timestamp: '2024-08-01T17:00:00',
    unique_users_count: 24051,
    cumulative_unique_users_count: 690379,
  },
  {
    timestamp: '2024-08-01T18:00:00',
    unique_users_count: 25774,
    cumulative_unique_users_count: 716153,
  },
  {
    timestamp: '2024-08-01T19:00:00',
    unique_users_count: 11416,
    cumulative_unique_users_count: 727569,
  },
  {
    timestamp: '2024-08-01T20:00:00',
    unique_users_count: 306,
    cumulative_unique_users_count: 727875,
  },
  {
    timestamp: '2024-08-01T21:00:00',
    unique_users_count: 79,
    cumulative_unique_users_count: 727954,
  },
  {
    timestamp: '2024-08-01T22:00:00',
    unique_users_count: 45,
    cumulative_unique_users_count: 727999,
  },
  {
    timestamp: '2024-08-01T23:00:00',
    unique_users_count: 38,
    cumulative_unique_users_count: 728037,
  },
  {
    timestamp: '2024-08-02T00:00:00',
    unique_users_count: 2664,
    cumulative_unique_users_count: 730701,
  },
  {
    timestamp: '2024-08-02T01:00:00',
    unique_users_count: 5824,
    cumulative_unique_users_count: 736525,
  },
  {
    timestamp: '2024-08-02T02:00:00',
    unique_users_count: 6837,
    cumulative_unique_users_count: 743362,
  },
  {
    timestamp: '2024-08-02T03:00:00',
    unique_users_count: 8201,
    cumulative_unique_users_count: 751563,
  },
  {
    timestamp: '2024-08-02T04:00:00',
    unique_users_count: 7928,
    cumulative_unique_users_count: 759491,
  },
  {
    timestamp: '2024-08-02T05:00:00',
    unique_users_count: 7683,
    cumulative_unique_users_count: 767174,
  },
  {
    timestamp: '2024-08-02T06:00:00',
    unique_users_count: 5718,
    cumulative_unique_users_count: 772892,
  },
]

const chartConfig = {
  cumulative_unique_users_count: {
    label: 'Cumulative',
    color: '#2563eb',
    // color: 'hsl(var(--chart-1))',
  },
  // cumulative_unique_users_count: {
  //   label: 'Mobile',
  //   color: 'hsl(var(--chart-2))',
  // },
} satisfies ChartConfig

export function Component() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>User growth</CardTitle>
        <CardDescription>Showing total users since the launch</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}>
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getHours().toString().padStart(2, '0')}:00`
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <defs>
              <linearGradient
                id="fillDesktop"
                x1="0"
                y1="0"
                x2="0"
                y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cumulative_unique_users_count)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cumulative_unique_users_count)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {/* <linearGradient
                id="fillMobile"
                x1="0"
                y1="0"
                x2="0"
                y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient> */}
            </defs>
            {/* <Area
              dataKey="unique_users_count"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            /> */}
            <Area
              dataKey="cumulative_unique_users_count"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-cumulative_unique_users_count)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">January - June 2024</div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  )
}

const Page = () => {
  return (
    <div className="flex-center w-full py-12">
      <Component />
    </div>
  )
}

export default Page
