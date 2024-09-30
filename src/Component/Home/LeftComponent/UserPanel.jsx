import React, { useEffect, useState } from 'react'
import { useSocket } from '../../../config/socket'
import ENDPOINTS from '../../../common/endpoints';
import axios from 'axios';
import { getNotificationChat } from '../../../common/Apis/ApiService';
import { useLoader } from '../../Loader/useLoader';
const LeftUserPanel = ({ sendrId, users, u, index, openChatPanel, isActive }) => {

    const socket = useSocket()
    const [notificationChat, setNotificationChat] = useState([])
    const { startLoading, stopLoading } = useLoader();

    const [chat, setChat] = useState([])
    const [notification, setnotification] = useState(0)
    let reciver_id = JSON.parse(localStorage.getItem('user_id'))

    const handleUserWithNoti = () => {

    }

    const showChats = async (id) => {
        await openChatPanel(id)
        let reciver_id = JSON.parse(localStorage.getItem('reciverId'))

        if (reciver_id == sendrId) {
            let notification = notificationChat.filter((chat) => {
                if (chat.reciver_id !== reciver_id && chat.sender_id !== sendrId) {
                    return chat
                }
            })

            setNotificationChat(notification)
        } else {
        }
    }

    useEffect(() => {
        let reciverId = JSON.parse(localStorage.getItem('reciverId'))
        let notification = notificationChat.filter((chat) => {
            if (chat?.is_read == 0) {
                if (chat.reciver_id == reciver_id && chat.sender_id == sendrId && reciverId !== sendrId) {
                    return chat
                }
            }

        })
        setnotification(notification)

    }, [notificationChat])

    useEffect(() => {
        if (!socket) return;
        socket.emit('reciveChat')
    }, [])


    useEffect(() => {
        (async () => {

            

            try{
                const body = {
                    reciver_id: reciver_id,
                    sender_id: sendrId
                }
                startLoading()
                const response = await getNotificationChat(body, true)
            // const res = await axios.post(ENDPOINTS.getNotificationChat, payload, {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // })
            console.log('grt noti', response)
            if (response?.status) {
                setNotificationChat(response.data.data)
            } else {
                alert(response.error)
            }

            }catch(err){
                alert(err.message)
            }finally{
                stopLoading()
            }

            
        })()

    }, [])


    useEffect(() => {
        if (Array.isArray(chat)) {
            setNotificationChat(prev => {
                const updatedNotifications = [...prev];
                chat.forEach(newChat => {
                    const index = updatedNotifications.findIndex(notification => notification?._id === newChat?._id);
                    if (index !== -1) {
                        updatedNotifications[index] = newChat;
                    } else {
                        updatedNotifications.push(newChat);
                    }
                });
                return updatedNotifications;
            });
            handleUserWithNoti()

        } else {
            setNotificationChat(prev => {
                const updatedNotifications = [...prev];
                const index = updatedNotifications.findIndex(notification => notification?._id === chat?._id);
                if (index !== -1) {
                    updatedNotifications[index] = chat;
                } else {
                    updatedNotifications.push(chat);
                }
                return updatedNotifications;
            });
            handleUserWithNoti()

        }
    }, [chat])



    useEffect(() => {

        if (!socket) return;

        socket.on('chatReciveNotificationSuccess', (data) => {
            setChat(data)
        });

    }, [socket])


    return (
        <div key={index} className="w-full chat-name px-4">
            <a onClick={() => showChats(u?._id)} className='w-full cursor-pointer'>
                <div className="w-full pt-2.5 relative">
                    {notification.length != 0 &&
                        <div className="notificstion absolute  top-[50%] translate-y-[-50%] right-0">
                            <div className='flex flex-col gap-3'>
                                <div className="time">
                                    <span className='text-[#1fa855] text-[12px]'>
                                        {
                                            notification.length !== 0
                                                ? notification[notification.length - 1]?.sent_time
                                                :
                                                ''
                                        }
                                    </span>
                                </div>
                                <div className="w-full h-full flex justify-center items-center">
                                    <div className="badge w-[21px] h-[21px] bg-[#25D366] rounded-full translate-y-[-50%] flex justify-center items-center">
                                        <span className='text-white text-[11px] font-medium'>
                                            {notification.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="flex">
                        <div className="pro-pic">
                            <div className="w-[49px] h-[49px] rounded-full overflow-hidden">
                                <img src={u.profile.profile_pic} className='w-full h-full object-cover' alt="" />
                            </div>
                        </div>

                        <div className="flex w-full flex-col pb-3 ms-4 border-b">
                            <div className="flex w-full justify-between">
                                <div className="name">
                                    <span className='text-[#111b21] text-[16px]'>{u.profile.username}</span>
                                </div>
                                <div className="date">
                                    {
                                        notification.length == 0 &&
                                        <span className='text-[12px]'>12/04/2024</span>
                                    }

                                </div>
                            </div>

                            <div className="last-msg">

                                {
                                    notification.length !== 0
                                        ? notification[notification.length - 1]?.is_read == 0
                                            ?
                                            <span className='text-[13px] text-[#1fa855]' style={{ fontWeight: '500' }}>{notification[notification.length - 1]?.message}</span>
                                            :
                                            <span className='text-[13px] text-[#667781]'>{notification[notification.length - 1]?.message}</span>
                                        :
                                        <span className='text-[13px] text-[#667781]'>Lorem ipsum dolor</span>
                                }


                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default LeftUserPanel
