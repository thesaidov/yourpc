import React, { useMemo } from 'react'
import { BaseChart } from './BaseChart';

export default function Chart({data, maxDataLength}) {
    const preparedData = useMemo(()=>{
        const stats = data.map(stat=>({value: (stat*100).toFixed(2)}))
        return [...stats, Array.from({length: maxDataLength - stats.length})]
    }, [data, maxDataLength])
    
  return (
    <BaseChart data={preparedData}/>
  )
}
