import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import { GrEmoji } from "react-icons/gr";
import moment from 'moment';
import Send from './Chat/Send'
import Recive from './Chat/Recive'
import { v4 as uuid } from 'uuid'
import { useSocket } from '../../../config/socket'
// import ringtone from '../../../public/messageTones/'
// import tone1 from '../../../public/messageTones/tone1.mp3'
import defaultImg from '../../../../public/images/default.png'
import ENDPOINTS from '../../../common/endpoints';
import { deleteChatBothside, deleteChatUserside, getUserChat, updateChat } from '../../../common/Apis/ApiService';
import {useAlert} from '../../../common/Toasts/AlertProvider'
import {useSuccess} from '../../../common/Toasts/SuccessProvider'
import { useLoader } from '../../Loader/useLoader';

const Rightside = ({ data }) => {

    const socket = useSocket();
    const audioRef = useRef(null);
    const { startLoading, stopLoading } = useLoader();

    let {alert} = useAlert()
    let {success} = useSuccess()

    const containerRef = useRef(null);
    const messageRefs = useRef({});
    const [visibleChats, setVisibleChats] = useState([]);


    let chatUser = useSelector((state) => state.handleChat.chatUser)
    const [vrPosition, setvrPosition] = useState('')
    const [hrPosition, sethrPosition] = useState('')
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [reciverId, setReciverId] = useState('')
    const [senderId, setSenderId] = useState('')
    const [username, setUsername] = useState('')
    const [msg, setMsg] = useState('')
    const [chats, setChats] = useState([])
    const [chatOptions, setChatOptions] = useState('')
    const [showOptions, setShowOptions] = useState(false)
    const [msgId, setmsgId] = useState('')
    const [editMsg, setEditMsg] = useState('')
    const [isOnline, setIsOnline] = useState(0)
    const [type, setType] = useState('')
    const [chatId, setChatId] = useState('')


    const observerCallback = useCallback((entries) => {
        entries.forEach(entry => {
            const messageId = entry.target.dataset.id;
            const chatObject = chats.find(chat => chat._id === messageId);
            if (entry.isIntersecting && chatObject) {
                setVisibleChats(prev => {
                    const isAlreadyVisible = prev.some(chat => chat._id === messageId);
                    if (!isAlreadyVisible) {
                        return [...prev, chatObject];
                    }
                    return prev;
                });
            } else {
                setVisibleChats(prev => prev.filter(chat => chat._id !== messageId));
            }
        });



    }, [chats]);

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
        const currentRefs = messageRefs.current;

        chats.forEach(chat => {
            if (currentRefs[chat._id]) {
                observer.observe(currentRefs[chat._id]);
            }
        });



        return () => {
            chats.forEach(chat => {
                if (currentRefs[chat._id]) {
                    observer.unobserve(currentRefs[chat._id]);
                }
            });
        };
    }, [chats, observerCallback]);

    // const playAudio = () => {
    //     if (audioRef.current) {
    //         audioRef.current.play();
    //         console.log('koko i am', audioRef.current)
    //     }
    //   };
    const playAudio = async () => {
        // var audio = new Audio();
        // audio.src = tone1;
        // audio.play()
    }

    useEffect(() => {

        if (visibleChats.length != 0) {
            if (!socket) return;
            socket.emit('chatRead', visibleChats)
        }

    }, [visibleChats])

    useEffect(() => {
        if (!socket) return;

        socket.on('loadNewChat', async (data) => {
            console.log('chat loadss success')
            socket.emit('chatSend', data)
            let sender_id = JSON.parse(localStorage.getItem('senderId'))
            let reciver_id = JSON.parse(localStorage.getItem('reciverId'))

            if (reciver_id == data.sender_id && data.reciver_id == sender_id) {
                setChats((prevChats) => {
                    const chatExists = prevChats.some(chat => chat._id === data._id);
                    if (!chatExists) {
                        return [...prevChats, data];
                    }
                    return prevChats;
                });
                // playAudio()

            }
            socket.emit('chatRecived', data._id)

        });

        socket.on('chatMessageDeleted', (id, data) => {

            if (data && data.reciver_id) {
                if (senderId == data.reciver_id) {
                    setChats(chats.map(item => item._id === data._id ? data : item))
                }
            }

        })

        socket.on('getOfflineUser', (id) => {
            let reciverId = JSON.parse(localStorage.getItem('reciverId'))

            if (reciverId == id) {
                setIsOnline(0)
            }

        });

        socket.on('getOnlineUser', (id) => {
            let reciverId = JSON.parse(localStorage.getItem('reciverId'))
            if (reciverId == id) {
                setIsOnline(1)
            }
        });
    }, [socket]);

    const handleScroll = () => {
    }



    const closePopup = () => {
        setOpenModal(false)
        setOpenEditModal(false)
    }

    const openDeleteModel = (id, type) => {
        setmsgId(id)
        setType(type)
        setOpenModal(true)
    }

    const openEditModel = (id) => {
        setmsgId(id)
        let msg = chats.find(item => item._id === id);
        setEditMsg(msg.message)
        setOpenEditModal(true)
    }

    const editMessage = async (e) => {
        e.preventDefault()
        // const token = JSON.parse(localStorage.getItem('token'))
        // const headers = { 'Authorization': `Bearer ${token}` };
        try{
            startLoading()
            const response = await updateChat(msgId, { msg: editMsg }, true)
            // const res = await axios.post(`${ENDPOINTS.updateChat}/${msgId}`, { msg: editMsg }, { headers })
    
            if (response?.status) {
                setChats(chats.map((item) => item._id === response.data.data._id ? response.data.data : item))
                socket.emit('editChat', response.data.data)
            }else{
                alert(response.error)
            }
        }catch(err){
            alert(err.message)
        }finally{
            stopLoading()
        }
        
        closePopup()

    }

    const optionMenu = (e, id, type) => {
        const container = containerRef.current;
        const child = e.target;

        if (container && child) {
            const containerRect = container.getBoundingClientRect();
            const { width, height } = container.getBoundingClientRect();
            const childRect = child.getBoundingClientRect();

            const x = childRect.left - containerRect.left;
            const y = childRect.top - containerRect.top;


            if (type == 'right') {
                if (y <= (height / 3)) {
                    setvrPosition('top-[5px]')
                    sethrPosition('right-[100%]')

                } else if (y >= (height / 3) && y <= ((height / 3) * 2)) {

                    setvrPosition('top-[-100px]')
                    sethrPosition('right-[150%]')

                } else {

                    setvrPosition('bottom-[20px]')
                    sethrPosition('right-[15px]')
                }
            } else {
                if (y <= (height / 3)) {
                    setvrPosition('top-[5px]')
                    sethrPosition('left-[20px]')

                } else if (y >= (height / 3) && y <= ((height / 3) * 2)) {

                    setvrPosition('top-[-150px]')
                    sethrPosition('left-[150%]')

                } else {

                    setvrPosition('bottom-[25px]')
                    sethrPosition('left-[15px]')
                }
            }

        }

        setShowOptions(!showOptions)
        setChatOptions(id)
    }

    const deleteMessages = (id) => {
        setChats(chats.filter((item) => item._id !== id));
    }


    const deleteForMe = async () => {
        try{
            startLoading()
            const response = await deleteChatUserside(msgId, true)
            // const res = await axios.get(`${ENDPOINTS.deleteChatUserside}/${msgId}`)
            if (response.status === true) {
                setChats(chats.filter((item) => item._id !== response.data.data._id));
                socket.emit('delete-chat', response.data.data._id)
                setOpenModal(!openModal)
                setChatOptions(false)
            }else{
                alert(response.error)
            }
        }catch(err){
            alert(err.message)
        }finally{
            stopLoading()
        }
       
    }

    const deleteForEveryone = async () => {

        // const token = JSON.parse(localStorage.getItem('token'))
        // const headers = { 'Authorization': `Bearer ${token}` };
        try{
            const response = await deleteChatBothside(msgId, true)
            // const res = await axios.get(`${ENDPOINTS.deleteChatBothside}/${msgId}`, { headers })
    
            if (response.status === true) {
                setChats(chats.map((item) => item._id === response.data.data._id ? response.data.data : item))
                socket.emit('delete-chat', response.data.data._id, response.data.data)
                setOpenModal(!openModal)
                setChatOptions(false)
            }else{
                alert(response.error)
            }
        }catch(err){
            alert(err.message)
        }finally{
            stopLoading()
        }
        
    }

    const deleteMessage = (id) => {
        setChatOptions(true)
    }

    let getChat = async () => {
        setMsg('')
        if (chatUser.length !== 0) {
            // const token = JSON.parse(localStorage.getItem('token'))
            // const headers = { 'Authorization': `Bearer ${token}` };
            try{
                let body = {
                    reciver_id: reciverId,
                }
                startLoading()
                // const res = await axios.post(ENDPOINTS.getChat, body, { headers })
                const response = await getUserChat(body, true)
    
                if(response.status){
                    setChats(response.data.data)
                }else{
                    alert(response.error)
                }
            }catch(err){
                alert(err.message)
            }finally{
                stopLoading()
            }
            

            const chatElement = document.querySelector('#chat-scroll');
            if (chatElement) {
                chatElement.scrollTop = chatElement.scrollHeight;
            }
        }
    }

    useEffect(() => {

        if (chatUser.length !== 0) {
            getChat()
            setIsOnline(data.is_online)
        }
    }, [data])

    useEffect(() => {
        localStorage.removeItem('senderId')
        localStorage.removeItem('reciverId')
        if (chatUser.length !== 0) {
            setReciverId(chatUser[0]._id);
            localStorage.setItem('senderId', JSON.stringify(chatUser[0].sender_id))
            localStorage.setItem('reciverId', JSON.stringify(chatUser[0]._id))
            setSenderId(chatUser[0].sender_id);
            setUsername(chatUser[0].username)
            getChat()
        }

    }, [chatUser])

    const loadChat = async(chat) => {


            
            socket.emit('chatSend', data)
            let sender_id = JSON.parse(localStorage.getItem('senderId'))
            let reciver_id = JSON.parse(localStorage.getItem('reciverId'))

            if (reciver_id == data.sender_id && data.reciver_id == sender_id) {
                setChats((prevChats) => {
                    const chatExists = prevChats.some(chat => chat._id === data._id);
                    if (!chatExists) {
                        return [...prevChats, data];
                    }
                    return prevChats;
                });
                // playAudio()

            }
            await socket.emit('chatRecived', data._id)

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data !== null && typeof data === 'object') {
            const token = JSON.parse(localStorage.getItem('token'))
            const headers = { 'Authorization': `Bearer ${token}` };


            let sender_id = JSON.parse(localStorage.getItem('senderId'))
            let reciver_id = JSON.parse(localStorage.getItem('reciverId'))
            const getCurrentTime = () => moment().format("HH:mm");
            let chat = {
                _id: (() => {
                    let id = uuid();
                    while (!id) {
                        id = uuid();
                    }
                    return id;
                })(),
                username: username,
                sender_id: sender_id,
                reciver_id: reciver_id,
                is_send: 0,
                is_recived: 0,
                is_read: 0,
                sent_time: getCurrentTime(),
                message: msg,
                delete_me: 0,
                edited: 0,
                delete_everyone: 0
            }

            setChats([...chats, chat])
            await socket.emit('newChat', { ...chat, token })
            loadChat(chat)
            setChatId(chat._id)

            setMsg('')
            const chatElement = document.querySelector('#chat-scroll');
            if (chatElement) {
                chatElement.scrollTop = chatElement.scrollHeight;
            }

        } else {
            alert('Reciver Not Found...')
        }
    }

    return (
        <>
            {openModal &&
                <div style={{ backgroundColor: 'rgba(255, 255, 255, .80' }} className="model-back fixed z-[9999] w-full h-full left-0 top-0">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="model top-[50%] left-[50%] pt-[12px] px-[24px] pb-[20px] rounded w-[500px] bg-[white]" style={{ boxShadow: '0 17px 50px 0 rgba(11, 20, 26, .19), 0 12px 15px 0 rgba(11, 20, 26, .24)' }}>
                            <div className="w-full flex justify-between pe-[5px]">
                                <div className="w-auto flex items-center">
                                    <span className='text-[#3B4A54] text-[14px]'>Delete message?</span>
                                </div>
                                <div className="cancel">
                                    <button onClick={closePopup} className=' text-[#3B4A54] font-medium py-[7px] px-[21px] text-[25px]'>
                                        <RxCross2 />
                                    </button>
                                </div>
                            </div>
                            <div className="w-full pt-[50px] px-[5px]">
                                <div className="w-full flex justify-end">
                                    <div className="flex gap-4">

                                        <button onClick={deleteForMe} className='py-[7px] px-[21px] text-[#008069] font-medium border-[#e9edef] border rounded-full text-[13px]'>Delete for me</button>

                                        {
                                            type === 'sender' &&
                                            <button onClick={deleteForEveryone} className='bg-[#008069] text-[white] font-medium py-[7px] px-[21px] border-[#e9edef] border rounded-full text-[13px]'>Delete everyone</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {openEditModal &&
                <div style={{ backgroundColor: 'rgba(255, 255, 255, .80' }} className="model-back fixed z-[9999] w-full h-full left-0 top-0">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="model top-[50%] left-[50%] rounded w-[550px] bg-[white]" style={{ boxShadow: '0 17px 50px 0 rgba(11, 20, 26, .19), 0 12px 15px 0 rgba(11, 20, 26, .24)' }}>
                            <div className="w-full flex justify-between ps-[25px] py-[15px] pe-[20px] bg-[#008069]">
                                <div className="cancel flex items-center">
                                    <button onClick={closePopup} className=' text-[#B3D9D2] font-bold pe-[24px] text-[22px]'>
                                        <RxCross2 strokeWidth={'1'} />
                                    </button>
                                    <span className='text-[#fff] font-medium text-[19px]'>Edit message</span>
                                </div>
                            </div>
                            <div className="w-full h-[175px] flex items-center edit-popup-bg bg-[#efeae2]">
                                <div className="w-full flex justify-end ">
                                    <div className="flex gap-4 w-full">

                                        <div className="w-full h-full ">
                                            <div className="w-full h-full">
                                                <div className="w-[100%] flex flex-wrap justify-center">
                                                    <div className={`chat-ele min-w-[95px] relative max-w-[64%] h-fit p-2 `}>
                                                        <div className='flex w-[100%] flex-wrap text-[14px] rounded-[10px]'>
                                                            <div style={{ boxShadow: '0 1px .5px rgba(11, 20, 26, .13)' }} className='relative w-[100%] rounded-[10px] bg-[#d9fdd3] border-0 ps-2 py-[6px] pe-[40px]'>

                                                                <span className='w-[20px] pe-[100px] break-words'>{editMsg}</span>

                                                                <div className="absolute bottom-0 right-[10px] flex flex-nowrap">
                                                                    <span className='text-[10.5px] ps-[2px] pe-[5px] pb-[1px]'>15:33</span>
                                                                    <div className='pb-[5px] flex items-end'>
                                                                        <svg viewBox="0 0 16 11" width="14" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>msg-dblcheck</title><path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path></svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-[#F0F2F5] py-[16px] px-[14px]">
                                <div className="w-full flex justify-end">
                                    <div className="flex w-full gap-4">

                                        <div className="w-full flex bg-white py-[9px] px-[12px] rounded-lg overflow-hidden items-center">
                                            <div className="w-full me-2">
                                                <input value={editMsg} onChange={(e) => setEditMsg(e.target.value)} className='w-full edit-input text-[#667781] outline-none border-0' type="text" placeholder='Type a message' />
                                            </div>
                                            <div className="emoji w-[auto] text-[20px] text-[#667781]">
                                                <GrEmoji />
                                            </div>
                                        </div>

                                        <div className="w-[auto]">
                                            <div className="w-full">
                                                <button onClick={(e) => editMessage(e)} className='rounded-full text-white w-[38px] h-[38px] bg-[#00A884] text-[24px] flex items-center justify-center'>
                                                    <FaCheck />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* <audio ref={audioRef} src={tone1} preload="auto" playsInline autoPlay loop>ok</audio> */}

            <div className="relative w-[100%] h-full right-side-bg">
                {
                    (typeof data === 'object' && data !== null) ? (

                        <div className='h-[100%]'>

                            <div className="chat-cont w-[100%] h-[100%] flex flex-col justify-between ">
                                <div className="w-[100%] chat-name px-4 bg-[#F0F2F5]">
                                    <div className="flex w-[100%] justify-between">
                                        <div className="w-[auto] py-3">
                                            <div className="flex">
                                                <div className="pro-pic">
                                                    <div className="w-[40px] h-[40px] rounded-full overflow-auto">
                                                        <img src={data.profile.profile_pic} className='w-full h-full object-cover' alt="" />
                                                    </div>
                                                </div>

                                                <div className="flex w-[100%] flex-col ms-4">
                                                    <div className="flex flex-col w-[100%] justify-between leading-tight">
                                                        <div className="name">
                                                            <span className='text-[#111b21] text-[16px]'>{data.profile.username}</span>
                                                        </div>
                                                        <div className="last-msg">
                                                            <span className='text-[13px] text-[#667781]'>{isOnline == 1 ? 'Online' : 'Offline'}</span>

                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex items-center'>
                                            <div className="flex gap-5 items-center">
                                                <div className="icon">
                                                    <div className="video flex py-1 px-2 border rounded-full gap-3 items-center">
                                                        <span>
                                                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>video-call</title><path d="M3.27096 7.31042C3 7.82381 3 8.49587 3 9.84V14.16C3 15.5041 3 16.1762 3.27096 16.6896C3.5093 17.1412 3.88961 17.5083 4.35738 17.7384C4.88916 18 5.58531 18 6.9776 18H13.1097C14.502 18 15.1982 18 15.7299 17.7384C16.1977 17.5083 16.578 17.1412 16.8164 16.6896C17.0873 16.1762 17.0873 15.5041 17.0873 14.16V9.84C17.0873 8.49587 17.0873 7.82381 16.8164 7.31042C16.578 6.85883 16.1977 6.49168 15.7299 6.26158C15.1982 6 14.502 6 13.1097 6H6.9776C5.58531 6 4.88916 6 4.35738 6.26158C3.88961 6.49168 3.5093 6.85883 3.27096 7.31042Z" ></path><path d="M18.7308 9.60844C18.5601 9.75994 18.4629 9.97355 18.4629 10.1974V13.8026C18.4629 14.0264 18.5601 14.2401 18.7308 14.3916L20.9567 16.3669C21.4879 16.8384 22.3462 16.4746 22.3462 15.778V8.22203C22.3462 7.52542 21.4879 7.16163 20.9567 7.63306L18.7308 9.60844Z" ></path></svg>
                                                        </span>

                                                        <span>
                                                            <svg viewBox="0 0 17 13" height="10" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 17 13"><title>chevron-down-alt</title><path d="M3.202,2.5l5.2,5.2l5.2-5.2l1.5,1.5l-6.7,6.5l-6.6-6.6L3.202,2.5z"></path></svg>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="icon me-2">
                                                    <span>
                                                        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24"><title>search-alt</title><path d="M15.9,14.3H15L14.7,14c1-1.1,1.6-2.7,1.6-4.3c0-3.7-3-6.7-6.7-6.7S3,6,3,9.7 s3,6.7,6.7,6.7c1.6,0,3.2-0.6,4.3-1.6l0.3,0.3v0.8l5.1,5.1l1.5-1.5L15.9,14.3z M9.7,14.3c-2.6,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6 s4.6,2.1,4.6,4.6S12.3,14.3,9.7,14.3z"></path></svg>
                                                    </span>
                                                </div>

                                                <div className="icon">
                                                    <span>
                                                        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24"><title>menu</title><path d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z"></path></svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id='chat-scroll' ref={containerRef} className="h-[100%] overflow-y-scroll overflow-x-clip pt-[10px]  px-[63px] z-50 chat-scroll">
                                    <div >
                                        {
                                            chats.map((msg, index) => (


                                                msg.sender_id == reciverId ?
                                                    //white
                                                    <div key={index} ref={el => messageRefs.current[msg._id] = el} data-id={msg._id} >
                                                        <Recive msg={msg} chatOptions={chatOptions} index={index} optionMenu={optionMenu} showOptions={showOptions} vrPosition={vrPosition} hrPosition={hrPosition} openDeleteModel={openDeleteModel} />
                                                    </div>
                                                    : msg.delete_me === 0 &&
                                                    //green
                                                    <Send isOnline={isOnline} key={index} chatId={chatId} msgId={msg._id} msg={msg} chatOptions={chatOptions} index={index} optionMenu={optionMenu} showOptions={showOptions} vrPosition={vrPosition} hrPosition={hrPosition} openDeleteModel={openDeleteModel} openEditModel={openEditModel} />
                                            ))
                                        }
                                    </div>

                                </div>

                                <div div className="w-[100%]  bg-[#f0f2f5]" >
                                    <div className="w-[100%]">
                                        <div className="flex px-4 py-3 items-center">
                                            <div className="flex w-[100%] gap-4">
                                                <div className='flex gap-4 w-[auto] items-center'>
                                                    <div className="smily">
                                                        <span>
                                                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="x23j0i4 xd7y6wv" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24"><title>smiley</title><path fill="#687780" d="M9.153,11.603c0.795,0,1.439-0.879,1.439-1.962S9.948,7.679,9.153,7.679 S7.714,8.558,7.714,9.641S8.358,11.603,9.153,11.603z M5.949,12.965c-0.026-0.307-0.131,5.218,6.063,5.551 c6.066-0.25,6.066-5.551,6.066-5.551C12,14.381,5.949,12.965,5.949,12.965z M17.312,14.073c0,0-0.669,1.959-5.051,1.959 c-3.505,0-5.388-1.164-5.607-1.959C6.654,14.073,12.566,15.128,17.312,14.073z M11.804,1.011c-6.195,0-10.826,5.022-10.826,11.217 s4.826,10.761,11.021,10.761S23.02,18.423,23.02,12.228C23.021,6.033,17.999,1.011,11.804,1.011z M12,21.354 c-5.273,0-9.381-3.886-9.381-9.159s3.942-9.548,9.215-9.548s9.548,4.275,9.548,9.548C21.381,17.467,17.273,21.354,12,21.354z  M15.108,11.603c0.795,0,1.439-0.879,1.439-1.962s-0.644-1.962-1.439-1.962s-1.439,0.879-1.439,1.962S14.313,11.603,15.108,11.603z"></path></svg>
                                                        </span>
                                                    </div>

                                                    <div className="plus">
                                                        <span>
                                                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>attach-menu-plus</title><path fillRule="evenodd" clipRule="evenodd" d="M20.5 13.2501L20.5 10.7501L13.25 10.7501L13.25 3.5L10.75 3.5L10.75 10.7501L3.5 10.7501L3.5 13.2501L10.75 13.2501L10.75 20.5L13.25 20.5L13.25 13.2501L20.5 13.2501Z" fill="#687780"></path></svg>
                                                        </span>
                                                    </div>
                                                </div>

                                                <form onSubmit={(e) => handleSubmit(e)} className='flex gap-4 w-[100%] items-center'>
                                                    <div className="msg-typ w-[100%]">
                                                        <input type="text" onChange={(e) => setMsg(e.target.value)} value={msg} className='msg-input rounded-md w-[100%] ps-5 p-1.5' placeholder='Type a message' />
                                                    </div>

                                                    <div className="mic">
                                                        {msg === '' ?
                                                            <span>

                                                                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24"><title>ptt</title><path fill="#687780" d="M11.999,14.942c2.001,0,3.531-1.53,3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531 S8.469,2.35,8.469,4.35v7.061C8.469,13.412,9.999,14.942,11.999,14.942z M18.237,11.412c0,3.531-2.942,6.002-6.237,6.002 s-6.237-2.471-6.237-6.002H3.761c0,4.001,3.178,7.297,7.061,7.885v3.884h2.354v-3.884c3.884-0.588,7.061-3.884,7.061-7.885 L18.237,11.412z"></path></svg>
                                                            </span>
                                                            :
                                                            <div className='flex items-center'>
                                                                <button>
                                                                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24"><title>send</title><path fill="#687780" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path></svg>
                                                                </button>
                                                            </div>
                                                        }
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        // ))
                    ) :
                        <div className='w-full h-full flex-col flex items-center justify-center py-4' style={{ background: 'linear-gradient(180deg, #f0f2f5 0%, #f0f2f5 100%)' }}>
                            <div className="w-full h-full flex flex-col items-center justify-between">
                                <div className='h-full flex flex-col items-center justify-center'>
                                    <div className="flex items-center justify-center w-[320px] h-[188px]">
                                        <div className="w-full">
                                            <img className='w-full h-full object-cover' src={defaultImg} alt="" />
                                        </div>
                                    </div>
                                    <div className="details w-full flex flex-col items-center justify-center">
                                        <h1 className='mt-[28px] text-[32px] text-[#41525d]'>Download WhatsApp for Windows</h1>
                                        <p className='text-[##54656f] text-[14px] mt-[24px]'>
                                            Make calls, share your screen and get a faster experience when you download the Windows app.
                                        </p>
                                        <button className='mt-[32px] py-[8px] px-[24px] bg-[#008069] text-[14px] text-white rounded-full'>
                                            Get from Microsoft Store
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full text-center mb-5">
                                    <span className='flex justify-center items-center'>
                                        <span className='text-[#8696A0] pe-1'>
                                            <svg viewBox="0 0 10 12" height="12" width="10" preserveAspectRatio="xMidYMid meet" className="" version="1.1"><title>lock-small</title><path d="M5.00847986,1.6 C6.38255462,1.6 7.50937014,2.67435859 7.5940156,4.02703389 L7.59911976,4.1906399 L7.599,5.462 L7.75719976,5.46214385 C8.34167974,5.46214385 8.81591972,5.94158383 8.81591972,6.53126381 L8.81591972,9.8834238 C8.81591972,10.4731038 8.34167974,10.9525438 7.75719976,10.9525438 L2.25767996,10.9525438 C1.67527998,10.9525438 1.2,10.4731038 1.2,9.8834238 L1.2,6.53126381 C1.2,5.94158383 1.67423998,5.46214385 2.25767996,5.46214385 L2.416,5.462 L2.41679995,4.1906399 C2.41679995,2.81636129 3.49135449,1.68973395 4.84478101,1.60510326 L5.00847986,1.6 Z M5.00847986,2.84799995 C4.31163824,2.84799995 3.73624912,3.38200845 3.6709675,4.06160439 L3.6647999,4.1906399 L3.663,5.462 L6.35,5.462 L6.35111981,4.1906399 C6.35111981,3.53817142 5.88169076,2.99180999 5.26310845,2.87228506 L5.13749818,2.85416626 L5.00847986,2.84799995 Z" fill="currentColor"></path></svg>
                                        </span>
                                        <span className='text-[#8696A0] text-[12px]'>
                                            Your personal messages are end-to-end encrypted
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </>

    )
}

export default Rightside
