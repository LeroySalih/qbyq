"use client"

import styles from "./index.module.css";
import { ResponsiveBar } from '@nivo/bar'


const Page = ({assignedPaperData}: any)=> {

const data = [
        {
          "country": "AD",
          "hot dog": 92,
          "hot dogColor": "hsl(345, 70%, 50%)",
          "burger": 14,
          "burgerColor": "hsl(27, 70%, 50%)",
          "sandwich": 167,
          "sandwichColor": "hsl(285, 70%, 50%)",
          "kebab": 152,
          "kebabColor": "hsl(347, 70%, 50%)",
          "fries": 41,
          "friesColor": "hsl(143, 70%, 50%)",
          "donut": 130,
          "donutColor": "hsl(228, 70%, 50%)"
        },
        {
          "country": "AE",
          "hot dog": 136,
          "hot dogColor": "hsl(284, 70%, 50%)",
          "burger": 75,
          "burgerColor": "hsl(98, 70%, 50%)",
          "sandwich": 199,
          "sandwichColor": "hsl(118, 70%, 50%)",
          "kebab": 191,
          "kebabColor": "hsl(299, 70%, 50%)",
          "fries": 16,
          "friesColor": "hsl(141, 70%, 50%)",
          "donut": 195,
          "donutColor": "hsl(251, 70%, 50%)"
        },
        {
          "country": "AF",
          "hot dog": 120,
          "hot dogColor": "hsl(207, 70%, 50%)",
          "burger": 170,
          "burgerColor": "hsl(212, 70%, 50%)",
          "sandwich": 143,
          "sandwichColor": "hsl(265, 70%, 50%)",
          "kebab": 152,
          "kebabColor": "hsl(216, 70%, 50%)",
          "fries": 38,
          "friesColor": "hsl(255, 70%, 50%)",
          "donut": 194,
          "donutColor": "hsl(338, 70%, 50%)"
        },
        {
          "country": "AG",
          "hot dog": 127,
          "hot dogColor": "hsl(309, 70%, 50%)",
          "burger": 58,
          "burgerColor": "hsl(23, 70%, 50%)",
          "sandwich": 140,
          "sandwichColor": "hsl(303, 70%, 50%)",
          "kebab": 186,
          "kebabColor": "hsl(82, 70%, 50%)",
          "fries": 145,
          "friesColor": "hsl(163, 70%, 50%)",
          "donut": 70,
          "donutColor": "hsl(28, 70%, 50%)"
        },
        {
          "country": "AI",
          "hot dog": 115,
          "hot dogColor": "hsl(154, 70%, 50%)",
          "burger": 142,
          "burgerColor": "hsl(187, 70%, 50%)",
          "sandwich": 120,
          "sandwichColor": "hsl(30, 70%, 50%)",
          "kebab": 93,
          "kebabColor": "hsl(106, 70%, 50%)",
          "fries": 27,
          "friesColor": "hsl(201, 70%, 50%)",
          "donut": 75,
          "donutColor": "hsl(83, 70%, 50%)"
        },
        {
          "country": "AL",
          "hot dog": 171,
          "hot dogColor": "hsl(187, 70%, 50%)",
          "burger": 35,
          "burgerColor": "hsl(119, 70%, 50%)",
          "sandwich": 151,
          "sandwichColor": "hsl(104, 70%, 50%)",
          "kebab": 30,
          "kebabColor": "hsl(353, 70%, 50%)",
          "fries": 58,
          "friesColor": "hsl(188, 70%, 50%)",
          "donut": 91,
          "donutColor": "hsl(47, 70%, 50%)"
        },
        {
          "country": "AM",
          "hot dog": 197,
          "hot dogColor": "hsl(131, 70%, 50%)",
          "burger": 89,
          "burgerColor": "hsl(222, 70%, 50%)",
          "sandwich": 60,
          "sandwichColor": "hsl(60, 70%, 50%)",
          "kebab": 159,
          "kebabColor": "hsl(48, 70%, 50%)",
          "fries": 87,
          "friesColor": "hsl(357, 70%, 50%)",
          "donut": 175,
          "donutColor": "hsl(330, 70%, 50%)"
        }
      ];

    return <div className={styles.graph}>
<ResponsiveBar
        data={assignedPaperData}
        keys={[
            'answermarks'
        ]}
        indexBy="markby"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Assigned Date',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'marks',
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
    />
    </div>
}

export default Page; 