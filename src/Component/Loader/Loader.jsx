import React from 'react'

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 z-[99999999999]" style={{width : '100vw', height : '100vh'}}>
        <div className="flex items-center justify-center" style={{width : '100%', height : '100%', backgroundColor : 'rgba(0,0,0,0.3)'}}>
        <div className="circle-1 w-[50px] h-[50px] rounded-full bg-transparent">
            <div className="w-full h-full bg-transparent flex items-center justify-center">
                <div className="circle-2 w-[45px] h-[45px] rounded-full bg-transparent">
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Loader
