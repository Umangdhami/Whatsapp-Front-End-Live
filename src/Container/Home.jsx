import React, { useEffect, useState } from 'react'
import SidebarLeft from '../Component/Home/LeftComponent/SidebarLeft'
import Rightside from '../Component/Home/RightComponents/Rightside'
import { useNavigate } from 'react-router'


const Home = () => {

    const [data, setData] = useState(null)
    const [reciver, setReciver] = useState(null);

    const navigate = useNavigate()

    const handeleChatUser = (user) => {
        setData(user[0])
        setReciver(user._id)
    };


    // useEffect(() => {
    //     (async () => {
    //         const token = localStorage.getItem('token')
    //         const headers = { 'Authorization': `Bearer ${token}` };
    //         const res = await axios.get(ENDPOINTS.getLoginUser, { headers })

    //         if(!res.data.status){
    //             console.log('hello')
    //             localStorage.clear()
    //             navigate('/')
    //         }
    //     })()
    // }, [])

    return (
        <>
            <section className='h-[100vh] w-full'>
                <div className='h-full w-full py-[18px] px-[110px]'>
                    <div className="top-bar fixed z-[-1] w-full left-0 top-0 h-[125px]  bg-[#00A884]">

                    </div>
                    {/* <div className="w-full h-[921px]  login-form bg-white">  */}
                    <div className="w-full h-[100%]  login-form bg-white">
                        <div className='w-full h-full'>
                            <div className="w-full h-full flex flex-wrap">
                                <div className="side-bar w-[30%] h-full">
                                    <SidebarLeft onButtonClick={handeleChatUser} />
                                </div>
                                <div className="right-side w-[70%] h-full">
                                    <Rightside reciver={reciver} data={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
