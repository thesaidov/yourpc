import { useEffect, useMemo, useState } from 'react'
import './App.css'
import useStatistics from './useStatistics'
import Chart from './Chart.jsx'

function App() {
  const [loading, setLoading] = useState(true)
  const staticData = [useStaticData()]
  const detailedInfo = useDetailedPcInfo()
  const [activeView, setActiveView] = useState("CPU")

  const statistics = useStatistics(10)
  const cpuUsage = useMemo(()=>statistics.map((stats)=>stats.cpuUsage), [statistics])
  const memoryUsage = useMemo(()=>statistics.map((stats)=>stats.memoryUsage), [statistics])
  const storageUsage = useMemo(()=>statistics.map((stats)=>stats.storageUsage), [statistics])

  const activeUsege = useMemo(()=>{
    switch (activeView) {
      case "CPU":
        return cpuUsage ?? cpuUsage
      case "STORAGE":
        return storageUsage
      case "RAM":
        return memoryUsage
    }
  }, [activeView, cpuUsage, storageUsage, memoryUsage])
    
  useEffect(()=>{
    window.electron.subscribeChangeView((view)=>setActiveView(view)) 
  }, [])

  // console.log(detailedInfo);

  function useDetailedPcInfo() {
  const [detailedInfo, setDetailedInfo] = useState("")
  useEffect(()=>{
    (async ()=>{
      setLoading(true)
      const info = await window.electron.getDetailedPcInfo()
      if (info.error) {
        console.log(info.error);
      }else{
        setDetailedInfo(info);
        setLoading(false)
      }
    })()
  }, [])
  return detailedInfo
}
  
  return (
    <>
    <div className='main'>
      <div className='selectOptions'>
        <SelectOption onClick={()=>setActiveView('CPU')} title={'CPU'} subTitle={staticData[0]?.cpuModel ?? ""} data={cpuUsage}/>
        <SelectOption onClick={()=>setActiveView('RAM')} title={'RAM'} subTitle={staticData[0]?.totalMemory ?? ""} data={memoryUsage}/>
        <SelectOption onClick={()=>setActiveView('STORAGE')} title={'Storage'} subTitle={staticData[0]?.totalStorage ?? ""} data={storageUsage}/>
      </div>
      <div className='mainGrid'>
        <Chart data={activeUsege} maxDataLength={10}/>
      </div>
      <div className='detailedInfo'>
        <div className='loading' style={loading ? {display: "flex"} : {display: "none"}}>Loading...</div>
        <div>
          <h2>CPU</h2>
          <ul>
            {Object.entries(detailedInfo?.cpu ?? {}).map((info, index)=>{
              if(typeof info[1] === "object"){
                return <li className='li' key={index}><span>{info[0]}</span>: <ul>
                  <li>l1d: {info[1].l1d}</li>
                  <li>l1i: {info[1].l1i}</li>
                  <li>l2: {info[1].l2}</li>
                  <li>l3: {info[1].l3}</li>
                  </ul>
                  </li>
              }else{
                return<li className='li' key={index}><span>{info[0]}</span>: {info[1] ? info[1].toString() : "false"}</li>
              }
            })}
          </ul>
        </div>
        <div>
          <h2>OS info</h2>
          <ul>{Object.entries(detailedInfo?.osInfo ?? {}).map((info, index)=>(
            <li key={index}><span>{info[0]}</span>: {info[1] ? info[1].toString() : "false"}</li>
          ))}</ul>
        </div>
        <div className='disks'>
          <h2>Disks</h2>
          <ul>{Object.entries(detailedInfo?.disks ? detailedInfo?.disks[0] : {error: "error"}).map((info, index)=>{
            return(<li key={index}><span>{info[0]}:</span> {info[1]}</li>)
          })}</ul>
          <ul>{Object.entries(detailedInfo?.disks ? detailedInfo?.disks[0] : {error: "error"}).map((info, index)=>{
            return(<li key={index}><span>{info[0]}:</span> {info[1]}</li>)
          })}</ul>
        </div>
      </div>
      <div className="detailedInfo2">
        <div className='loading' style={loading ? {display: "flex"} : {display: "none"}}>Loading...</div>
        <div>
          <h2>Battery</h2>
          <ul>
            {Object.entries(detailedInfo?.battery ?? {}).map((info, index)=>(
              <li key={index}><span>{info[0]}</span>: {info[1] ? info[1].toString() : "false"}</li>
            ))}
          </ul>
        </div>
        <div className='graphics'>
          <div>
            <h2>Graphics: Controllers</h2>
            <ul>{Object.entries(detailedInfo?.graphics?.controllers[0] ?? {}).map((info, index)=>(
              <li key={index}><span>{info[0]}</span>: {info[1].toString()}</li>
            ))}</ul>
            <ul>{Object.entries(detailedInfo?.graphics?.controllers[1] ?? {}).map((info, index)=>(
              <li key={index}><span>{info[0]}</span>: {info[1].toString()}</li>
            ))}</ul>
          </div>
          <div>
            <h2>Graphics: Displays</h2>
            <ul>{Object.entries(detailedInfo?.graphics?.displays[0] ?? {}).map((info, index)=>(
              <li key={index}><span>{info[0]}</span>: {info[1].toString()}</li>
            ))}</ul>
          </div>
        </div>
        <div className="network">
          <h2>Network</h2>
          <ul>{Object.entries(detailedInfo?.network ? detailedInfo.network[0] : {error: ""}).map((info, index)=>{
            return(<li key={index}><span>{info[0]}:</span> {info[1]}</li>)
          })}</ul>
          <ul>{Object.entries(detailedInfo?.network ? detailedInfo.network[1] : {error: ""}).map((info, index)=>{
            return(<li key={index}><span>{info[0]}:</span> {info[1]}</li>)
          })}</ul>
          <ul>{Object.entries(detailedInfo?.network ? detailedInfo.network[2] : {error: ""}).map((info, index)=>{
            return(<li key={index}><span>{info[0]}:</span> {info[1]}</li>)
          })}</ul>
          <ul>{Object.entries(detailedInfo?.network ? detailedInfo.network[3] : {error: ""}).map((info, index)=>{
            return(<li key={index}><span>{info[0]}:</span> {info[1]}</li>)
          })}</ul>
          <ul>{Object.entries(detailedInfo?.network ? detailedInfo.network[4] : {error: ""}).map((info, index)=>{
            return(<li key={index}><span>{info[0]}:</span> {info[1]}</li>)
          })}</ul>
        </div>
      </div>
    </div>
    </>
  )
}

function SelectOption({title, subTitle, data, onClick}) {
  return(
    <button className='selectOption' onClick={onClick}>
      <div className='selectOptionTitle'>
        <div>{title}</div>
        <div>{subTitle}</div>
      </div>
      <div className='selectOptionChart'>
        <Chart data={data} maxDataLength={10}/>
      </div>
    </button>
  )
}


function useStaticData() {
  const [staticData, setStaticData] = useState()
  useEffect(()=>{
    (async ()=>{
      setStaticData(await window.electron.getStaticData())
    })()
  }, [])
  return staticData
}



export default App
