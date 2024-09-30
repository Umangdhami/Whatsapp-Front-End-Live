import React, { useEffect, useState } from 'react'
import { FaAngleDown } from "react-icons/fa6";
import { useSocket } from '../../../../config/socket'
import axios from 'axios';
import ENDPOINTS from '../../../../common/endpoints';
import { chatSended, reciveChatSuccess } from '../../../../common/Apis/ApiService';
import { useLoader } from '../../../Loader/useLoader';

const Send = ({ isOnline, chatId, msgId, msg, chatOptions, index, optionMenu, showOptions, vrPosition, hrPosition, openDeleteModel, openEditModel }) => {

    const socket = useSocket();
    const { startLoading, stopLoading } = useLoader();
    const [isSend, setIsSend] = useState(0)
    const [isRecive, setIsRecive] = useState(0)
    const [isRead, setIsRead] = useState(0)

    useEffect(() => {

        (async () => {
            setIsRecive(msg.is_recived)
            setIsRead(msg.is_read)
            if (msg.is_read == 0 && isOnline == 0) {
                // const token = JSON.parse(localStorage.getItem('token'))
                // const headers = { 'Authorization': `Bearer ${token}` };
                try{
                    // startLoading()
                    const response = await chatSended(msg, true)
                    // const res = await axios.post(ENDPOINTS.chatSended, msg, { headers })
                    console.log(response, 'oo')
                    if (response?.status) {
                        setIsSend(1)
                    } else {
                        setIsSend(0)
                    }
                }catch(err){
                    alert(err.message)
                }
                // finally{
                //     stopLoading()
                // }
                

            }
        })()
    }, [msg])

    if (!socket) return;
    socket.on('chatSendSuccess', async (data) => {
        console.log('chat sendded')
        if (data?._id == msg?._id) {
            setIsSend(1)
        }
    });

    socket.on('chatRecivedSuccess', (data) => {
        if (data?._id == msg?._id) {
            setIsRecive(1)
        }
    });

    socket.on('chatReadSuccess', (data) => {
        if (data.length != 0) {
            data.filter((chat) => {
                if (chat?._id == msg?._id) {
                    setIsRead(1)
                }
            })
        }
    });

    socket.on('reciveChatToUser', async () => {

        if (isRecive == 0) {
            (async () => {
                try{
                    startLoading()
                    const response = await reciveChatSuccess({id : msg?._id}, true)
                    // const res = await axios.post(ENDPOINTS.reciveChatSuccess, {id : msg?._id}, { headers })
    
                    if (response?.status) {
                        setIsRecive(1)
                    } else {
                        setIsRecive(0)
                    }
                }catch(err){
                    alert(err.message)
                }finally{
                    stopLoading()
                }
                
            })()
        }
    })

    return (
        <div>
            <div key={index} className="w-[100%] flex flex-wrap justify-end">
                <div className={`chat-ele min-w-[95px] relative max-w-[64%] h-fit p-2 `}>

                    <div style={{ background: 'radial-gradient(at top right, rgba(217, 253, 211, 1) 60%, rgba(217, 253, 211, 0) 80%)' }} className="cursor-pointer opacity-0 option absolute right-[5px] top-[13px] ps-[23px] z-[1] pb-[3px]">
                        <div className='relative'>
                            <button className='text-[#8696a0]' onClick={(e) => optionMenu(e, msg?._id, 'right')}>
                                <FaAngleDown className='text-[18px]' />
                            </button>
                            {
                                chatOptions === msg?._id && showOptions &&

                                <div className={`absolute chatoptions ${vrPosition} ${hrPosition}`}>
                                    <div style={{ transition: '.5s' }} className={(chatOptions === msg?._id && showOptions) ? `animations w-[168px] overflow-hidden bg-white py-[9px] rounded-lg z-[222]` : " "}>
                                        <div className="flex h-auto">
                                            <ul className="flex flex-col w-[100%]">
                                                <li className='hover:bg-[#f5f6f6]'>
                                                    <div className="ps-[24px] py-[8px] w-[100%] flex justify-start">
                                                        <button onClick={() => deleteMessage(msg?._id)} className='text-[#3B4A54]' style={{ fontWeight: '100' }}>Message info</button>
                                                    </div>
                                                </li>
                                                <li className='hover:bg-[#f5f6f6]'>
                                                    <div className="ps-[24px] py-[8px] w-[100%] flex justify-start">
                                                        <button onClick={() => deleteMessage(msg?._id)} className='text-[#3B4A54]' style={{ fontWeight: '100' }}>Reply</button>
                                                    </div>
                                                </li>
                                                <li className='hover:bg-[#f5f6f6]'>
                                                    <div className="ps-[24px] py-[8px] w-[100%] flex justify-start">
                                                        <button onClick={() => deleteMessage(msg?._id)} className='text-[#3B4A54]' style={{ fontWeight: '100' }}>React</button>
                                                    </div>
                                                </li>
                                                <li className='hover:bg-[#f5f6f6]'>
                                                    <div className="ps-[24px] py-[8px] w-[100%] flex justify-start">
                                                        <button onClick={() => deleteMessage(msg?._id)} className='text-[#3B4A54]' style={{ fontWeight: '100' }}>Forward</button>
                                                    </div>
                                                </li>
                                                <li className='hover:bg-[#f5f6f6]'>
                                                    <div className="ps-[24px] py-[8px] w-[100%] flex justify-start">
                                                        <button onClick={() => deleteMessage(msg?._id)} className='text-[#3B4A54]' style={{ fontWeight: '100' }}>Pin</button>
                                                    </div>
                                                </li>
                                                <li className='hover:bg-[#f5f6f6]'>
                                                    <div className="ps-[24px] py-[8px] w-[100%] flex justify-start">
                                                        <button onClick={() => deleteMessage(msg?._id)} className='text-[#3B4A54]' style={{ fontWeight: '100' }}>Star</button>
                                                    </div>
                                                </li>
                                                <li className='hover:bg-[#f5f6f6]'>
                                                    <div className="ps-[24px] py-[8px] w-[100%] flex justify-start">
                                                        <button onClick={() => openEditModel(msg?._id)} className='text-[#3B4A54]' style={{ fontWeight: '100' }}>Edit</button>
                                                    </div>
                                                </li>
                                                <li className='hover:bg-[#f5f6f6]'>
                                                    <div className="ps-[24px] py-[8px] w-[100%] flex justify-start">
                                                        <button onClick={() => openDeleteModel(msg?._id, 'sender')} className='text-[#3B4A54]' style={{ fontWeight: '100' }}>Delete</button>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            }
                        </div>
                    </div>

                    <div className='flex w-[100%] flex-wrap text-[14px] rounded-[10px]'>
                        <div style={{ boxShadow: '0 1px .5px rgba(11, 20, 26, .13)' }} className={`relative w-full rounded-[10px] bg-[#d9fdd3] border-0 ps-2 py-[6px] ${msg.edited ? 'pe-[78px]' : 'pe-[40px]'}`}>

                            <span className='w-[20px] pe-[20px] break-words'>{msg.delete_everyone === 0 ? msg.message : 'This message deleted'}</span>

                            <div className="absolute bottom-0 right-[10px] flex flex-nowrap">
                                <span className='text-[10.5px] ps-[2px] pe-[5px] pb-[1px]'>
                                    <span className={msg.edited == 1 ? 'pe-[5px]' : ''}>
                                        {msg.edited == 1 ? 'Edited' : ''}
                                    </span>
                                    <span>{msg.sent_time}</span>
                                </span>
                                <div className='pb-[5px] flex items-end'>

                                    {

                                        isSend == 0 && isRecive == 0 ?
                                            <svg viewBox="0 0 16 15" width="16" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 16 15"><title>msg-time</title><path fill="currentColor" d="M9.75,7.713H8.244V5.359c0-0.276-0.224-0.5-0.5-0.5H7.65c-0.276,0-0.5,0.224-0.5,0.5v2.947 c0,0.276,0.224,0.5,0.5,0.5h0.094c0.001,0,0.002-0.001,0.003-0.001S7.749,8.807,7.75,8.807h2c0.276,0,0.5-0.224,0.5-0.5V8.213 C10.25,7.937,10.026,7.713,9.75,7.713z M9.75,2.45h-3.5c-1.82,0-3.3,1.48-3.3,3.3v3.5c0,1.82,1.48,3.3,3.3,3.3h3.5 c1.82,0,3.3-1.48,3.3-3.3v-3.5C13.05,3.93,11.57,2.45,9.75,2.45z M11.75,9.25c0,1.105-0.895,2-2,2h-3.5c-1.104,0-2-0.895-2-2v-3.5 c0-1.104,0.896-2,2-2h3.5c1.105,0,2,0.896,2,2V9.25z"></path></svg>

                                            :
                                            isSend == 1 && isRecive == 0 ?
                                                <svg viewBox="0 0 12 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>msg-check</title><path d="M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z" fill="currentcolor"></path></svg>
                                                :
                                                isSend == 1 && isRecive == 1 && isRead == 0 ?
                                                    // #53bdeb
                                                    <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>msg-dblcheck</title><path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentcolor"></path></svg>

                                                    :

                                                    <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>msg-dblcheck</title><path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="#53bdeb"></path></svg>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Send
