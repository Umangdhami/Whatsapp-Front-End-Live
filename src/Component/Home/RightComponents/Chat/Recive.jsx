import React from 'react'
import { FaAngleDown } from "react-icons/fa6";

const Recive = ({msg, chatOptions, index, optionMenu, showOptions, vrPosition, hrPosition, openDeleteModel }) => {
    return (
        <div>
            <div key={index} className=" w-[100%] flex flex-wrap ">
                <div className="chat-ele min-w-[30px] relative max-w-[64%] h-fit p-2">

                    <div style={{ background: 'radial-gradient(at top right, rgba(255, 255, 255, 1) 60%, rgba(255, 255, 255, 0) 80%)' }} className="cursor-pointer opacity-0 option absolute right-[5px] top-[13px] z-50 ps-[23px] pb-[1px]">
                        <div className='relative'>
                            <button className='text-[#8696a0]' onClick={(e) => optionMenu(e, msg?._id, 'left')}>
                                <FaAngleDown className='text-[18px]' />
                            </button>
                            {
                                chatOptions === msg?._id && showOptions &&

                                <div className={`absolute chatoptions ${vrPosition} ${hrPosition}`}>
                                    <div style={{ transition: '.5s' }} className={(chatOptions === msg?._id && showOptions) ? `animations w-[168px] overflow-hidden bg-white py-[9px] rounded-lg` : " "}>
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
                                                        <button onClick={() => openDeleteModel(msg?._id, 'reciver')} className='text-[#3B4A54]' style={{ fontWeight: '100' }}>Delete</button>
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
                        <div style={{ boxShadow: '0 1px .5px rgba(11, 20, 26, .13)' }} className={`relative w-[100%] rounded-[10px] bg-[white] ps-2 pt-[4px] pb-[6px] ${msg.edited == 1 ? 'pe-[64px]' : 'pe-[30px]'}`}>

                            <span className='w-[20px] font-extralight pe-[13px] break-words'>{msg.delete_everyone === 0 ? msg.message : 'This message deleted'}</span>

                            <div className="absolute bottom-0 right-[8px] flex flex-nowrap">
                                <span className='text-[10.5px] pb-[2px] font-extralight  pe-[0]'>
                                    <span className='pe-[5px]'>{msg.edited == 1 ? 'Edited' : ''}</span>
                                    <span>{msg.sent_time}</span>
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recive
