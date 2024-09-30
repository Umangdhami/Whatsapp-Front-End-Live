import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { RiArrowLeftSLine } from "react-icons/ri";
import { RiPencilFill } from "react-icons/ri";
import ENDPOINTS from '../../../common/endpoints';
import { MdClose } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import Moveable from 'react-moveable';
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import {getProfile, removeProfilePic, updateProfile} from '../../../common/Apis/ApiService'
import {useAlert} from '../../../common/Toasts/AlertProvider'
import {useSuccess} from '../../../common/Toasts/SuccessProvider'
import { useLoader } from '../../Loader/useLoader';

const ProfileUpdate = ({ setScale, scale }) => {
    const { startLoading, stopLoading } = useLoader();
    const [profile, setProfile] = useState(null)
    const [model, setModel] = useState(false)
    const [topPosition, setTopPosition] = useState(10)
    const [leftPosition, setLeftPosition] = useState(10)
    const [modelScale, setModelScale] = useState(false)
    const [height, setHeight] = useState(window.innerHeight);
    const containerRef = useRef(null);
    const [viewModel, setViewModel] = useState(false)
    const [ok, setok] = useState(true)
    const [containerReact, setContainerReact] = useState(containerRef?.current?.getBoundingClientRect())
    const [openModal, setOpenModal] = useState(false);
    const [takeModel, setTakeModel] = useState(false)
    const [uploadModel, setUploadModel] = useState(false)
    const [file, setFile] = useState(null)
    const fileRef = useRef(null)
    const [base64, setBase64] = useState(null);
    const [profilePic, setProfilePic] = useState('')
    const [proUsername, setProUsername] = useState('')
    const [stream, setStream] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const videoRef = useRef(null);
    const nameRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasImgRef = useRef(null);
    const canvasRef2 = useRef(null);
    const [image, setImage] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [start, setStart] = useState({ x: 0, y: 0 });
    const [scaleX, setScaleX] = useState(1);
    const [zoomImgWidth, setzoomImgWidth] = useState(0)
    const [zoomImgHeight, setzoomImgHeight] = useState(0)
    const [takeImgAdjust, setTakeImgAdjust] = useState(false)
    const [type, setType] = useState(null)
    const [editName, setEditName] = useState(false)
    const [updateName, setUpdateName] = useState(proUsername)
    const [slideRight, setSlideRight] = useState(false)

    const {alert} = useAlert()
    const {success} = useSuccess()

    const drawImage = (img, x, y, scaleX = 1) => {
        const canvas = canvasImgRef?.current;
        if (!canvas) return; // Early return if canvas is not available
        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Early return if context is not available
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        if (!img || !img.width || !img.height) return; // Early return if image is not valid

        // Limit scaleX to a maximum of 3 (triple zoom) and minimum of 1 (no zoom out)
        const limitedScaleX = Math.min(Math.max(scaleX, 1), 3);

        const imgWidth = img.width * limitedScaleX;
        const imgHeight = img.height * limitedScaleX;

        setzoomImgWidth(imgWidth);
        setzoomImgHeight(imgHeight);

        const canvasAspect = canvasWidth / canvasHeight;
        const imgAspect = imgWidth / imgHeight;

        let drawWidth, drawHeight;

        if (imgAspect > canvasAspect) {
            // Image is wider relative to the canvas
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgAspect;
        } else {
            // Image is taller relative to the canvas
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgAspect;
        }

        const dx = x - (drawWidth - canvasWidth) / 2;
        const dy = y - (drawHeight - canvasHeight) / 2;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, dx, dy, drawWidth * limitedScaleX, drawHeight * limitedScaleX);
    };


    const drawCircularMask = (canvas) => {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 155; // Changed to 155 for a 310px diameter circle

            // ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
            ctx.fill();

            const boundingBox = {
                x: centerX - radius,
                y: centerY - radius,
                width: radius * 2,
                height: radius * 2
            };

            console.log(`Circle Center: (${centerX}, ${centerY})`);
            console.log(`Circle Radius: ${radius}`);
            console.log(`Bounding Box - X: ${boundingBox.x}, Y: ${boundingBox.y}, Width: ${boundingBox.width}, Height: ${boundingBox.height}`);
        }
    };

    useEffect(() => {
        if (base64) {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
                setImage(img);
                updateCanvasSize();
                drawImage(img, position?.x, position?.y, scaleX);
            };
        }
    }, [base64, scaleX, position]);


    const handleZoom = (factor) => {
        setScaleX(prevScaleX => {
            const newScaleX = Math.min(Math.max(prevScaleX * factor, 1), 3); // constrain zoom level between 1 and 2
            drawImage(image, position?.x, position?.y, newScaleX);
            return newScaleX;
        });
    };



    const handleMouseDown = (e) => {
        setDragging(true);
        setStart({
            x: e.nativeEvent.offsetX - position.x * scaleX,
            y: e.nativeEvent.offsetY - position.y * scaleX,
        });
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            const x = (e.nativeEvent.offsetX - start.x) / scaleX;
            const y = (e.nativeEvent.offsetY - start.y) / scaleX;
            setPosition({ x, y });
            console.log('client', zoomImgWidth, zoomImgHeight)
            // setDragging(false);
            drawImage(image, x, y, scaleX);
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const updateCanvasSize = () => {
        const canvas = canvasImgRef.current;
        if (canvas) {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            // console.log(canvas.width, canvas.height, 'client')
            drawImage(image, position?.x, position?.y, scaleX);
        }
    };

    // const handleSubmit = () => {
    //     const canvas = canvasImgRef.current;
    //     const tempCanvas = document.createElement('canvas');
    //     const tempCtx = tempCanvas.getContext('2d');

    //     // Define the size of the square
    //     const squareSize = 310; // The size of the square you want to crop (same as 2 * 155 for circular)

    //     // Set the temp canvas size to the size of the square area
    //     tempCanvas.width = squareSize;
    //     tempCanvas.height = squareSize;

    //     // Draw the square area from the main canvas into the temp canvas
    //     tempCtx.drawImage(
    //         canvas,
    //         (canvas.width / 2) - (squareSize / 2),
    //         (canvas.height / 2) - (squareSize / 2),
    //         squareSize,
    //         squareSize,
    //         0,
    //         0,
    //         squareSize,
    //         squareSize
    //     );

    //     // Resize the cropped square image to 200x200
    //     const outputCanvas = document.createElement('canvas');
    //     const outputCtx = outputCanvas.getContext('2d');
    //     outputCanvas.width = 200;
    //     outputCanvas.height = 200;

    //     outputCtx.drawImage(tempCanvas, 0, 0, 200, 200);

    //     // Convert the output canvas to a file
    //     outputCanvas.toBlob((blob) => {
    //         const fileName = 'profile-image.jpg';  // or any other name
    //         const fileType = 'image/jpeg';         // or 'image/png' based on your preference

    //         const file = new File([blob], fileName, {
    //             type: fileType,
    //             lastModified: Date.now(), // Current timestamp
    //         });
    //         console.log(file, 'new load file');
    //         fileRef.current.value = ''

    //         // Now you can upload the image or use it as required
    //         updateProfileById(profile.profile?._id, file);
    //     }, 'image/jpeg');
    // };

    const handleSubmit = () => {
        const canvas = canvasImgRef.current;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        // Define the size of the square
        const squareSize = 310; // The size of the square you want to crop (same as 2 * 155 for circular)

        // Set the temp canvas size to the size of the square area
        tempCanvas.width = squareSize;
        tempCanvas.height = squareSize;

        // Draw the square area from the main canvas into the temp canvas
        tempCtx.drawImage(
            canvas,
            (canvas.width / 2) - (squareSize / 2),
            (canvas.height / 2) - (squareSize / 2),
            squareSize,
            squareSize,
            0,
            0,
            squareSize,
            squareSize
        );

        // Resize the cropped square image to a higher resolution initially
        const highResCanvas = document.createElement('canvas');
        const highResCtx = highResCanvas.getContext('2d');
        highResCanvas.width = 800; // Higher resolution for better quality
        highResCanvas.height = 800;

        highResCtx.drawImage(tempCanvas, 0, 0, 800, 800);

        // Gradually downscale the high-resolution image to 200x200 to preserve quality
        const outputCanvas = document.createElement('canvas');
        const outputCtx = outputCanvas.getContext('2d');
        outputCanvas.width = 400;
        outputCanvas.height = 400;

        outputCtx.drawImage(highResCanvas, 0, 0, 400, 400);

        // Convert the output canvas to a file
        outputCanvas.toBlob((blob) => {
            const fileName = 'profile-image.jpg';  // or any other name
            const fileType = 'image/jpeg';         // or 'image/png' based on your preference

            const file = new File([blob], fileName, {
                type: fileType,
                lastModified: Date.now(), // Current timestamp
            });
            console.log(file, 'new load file');
            fileRef.current.value = '';

            // Now you can upload the image or use it as required
            updateProfileById(profile.profile?._id, {profile_pic  : file});
        }, 'image/jpeg');
    };





    useEffect(() => {
        (async () => {
            try {
                // const token = JSON.parse(localStorage.getItem('token'))
                // const headers = { 'Authorization': `Bearer ${token}` };
                startLoading()
                const response = await getProfile(true)
                // const res = await axios.get(ENDPOINTS.getProfile, { headers })

                if (response?.status) {
                    setProfile(response.data?.data[0])
                    setProfilePic(response.data?.data[0]?.profile?.profile_pic)
                    setProUsername(response.data?.data[0]?.profile?.username)
                    setUpdateName(response.data?.data[0]?.profile?.username)
                } else {
                    localStorage.clear()
                    alert(response.error)
                }
            } catch (err) {
                console.log(err, 'eeeeeror')
                window.alert(err.message)
            }finally{
                stopLoading()
            }
        })()
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const closeProfile = () => {
        setScale('0')
    }

    const openMenu = (e) => {

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const container = containerRef.current;
        const { width, height } = container.getBoundingClientRect();
        setModel(!model);

        setModelScale(!modelScale)
        setTopPosition(y - 10);
        setLeftPosition(x + 10);
    };

    const viewPhoto = (e) => {
        containerRef.current.click()
        setViewModel(true)
        setModelScale(!modelScale)
    }

    const closeViewPhoto = (e) => {
        e.target.disabled = true;
        const rect = containerRef.current.getBoundingClientRect();
        setContainerReact(rect)
        setok(false)
        setTimeout(() => {
            setViewModel(false)
            setok(true)
            e.target.disabled = false;
        }, 440);
    }

    const openRemovePhotoModel = async () => {
        setModelScale(false)
        setOpenModal(!openModal)
    }

    const removeProfilePhoto = async (id) => {
        try {

            startLoading()
            openRemovePhotoModel()
            const headers = { 'Content-Type': 'multipart/form-data' };
            const response = await removeProfilePic(id, true, headers)
            // const res = await axios.delete(`${ENDPOINTS.removeProfilePhoto}/${id}`, { headers })

            if (response.status) {
                setProfilePic(response.data?.data?.profile_pic)
            } else {
               alert(response.error)
            }

        } catch (error) {
            alert(error.message)
        }finally{
            stopLoading()
        }
    }

    const openTakeModel = async () => {
        setTakeImgAdjust(false)
        setTakeModel(!takeModel)

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
        }
    }

    const openUploadModel = async () => {
        setTakeImgAdjust(true)
        setModelScale(false)
        await fileRef.current.click()
    }

    const closePopup = () => {
        setFile(null)
        fileRef.current.value = '';
        setUploadModel(false)
        setBase64(null)
        setTakeModel(false)
    }

    const updateProfileById = async (id, body) => {
        try {
            console.log('object nfmb', id)
            let data = {}
            const headers = { 'Content-Type': 'multipart/form-data' };
            const formdata = new FormData();
            formdata.append("profile_pic", file);

            for (const key in body) {
                if (body.hasOwnProperty(key)) {
                    data[key] = body[key]
                    formdata.append(`${key}`, body[key]);
                }
            }
            console.log(data, 'data')
            startLoading()
            // const res = await axios.post(`${ENDPOINTS.updateProfile}/${id}`, data, { headers })
            const response = await updateProfile(id, data, true, headers)

            if(response.status){
                setProfilePic(response.data?.data?.profile_pic)
                setProUsername(response.data?.data?.username)
                setFile(null)
                closePopup()
                success('Profile Pic Updated...')
            }else{
                alert(response.error)
            }

            // if (res.data?.status && res.data?.statusCode == 200) {
            //     setProfilePic(res.data?.data?.profile_pic)
            //     setProUsername(res.data?.data?.username)
            //     setFile(null)
            //     closePopup()
            // } else {
            //     throw new Error(res.data?.message);
            // }

        } catch (error) {
            window.alert(error.message)
        }finally{
            stopLoading()
        }
    }


    const closeTakePhoto = () => {

        if (stream) {
            stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
            setStream(null);
            if (videoRef.current) {
                videoRef.current.srcObject = null; // Clear the video source
            }
            setTakeModel(false)
        }
    }

    const handleTakePhoto = async (id) => {

        console.log(id, profile, 'take photo')

        // return id
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Convert the canvas content to a Blob
            canvas.toBlob(async (blob) => {
                const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
                // setPhotoFile(file);
                setFile(file)
                // setType('video')
                closeTakePhoto()
                // try {
                //     const token = localStorage.getItem('token')
                //     const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
                //     const formData = new FormData();
                //     formdata?.append("profile_pic", file);
                //     const res = await axios.post(`${ENDPOINTS.updateProfilePhoto}/${id}`, formData, { headers })

                //     if (res.data?.status && res.data?.statusCode == 200) {
                //         setProfilePic(res.data?.data?.profile_pic)
                //         closeTakePhoto()
                //     } else {
                //         throw new Error(res.data?.message);
                //     }

                // } catch (error) {
                //     window.alert(error.message)
                // }
                console.log("Photo file:", file);
            }, 'image/jpeg');
        }


    }

    useEffect(() => {
        console.log(file)

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64(reader.result);
            };
            reader.readAsDataURL(file);
            if (type == 'video') {
                setUploadModel(true)
                // setTakeImgAdjust(false)
            } else {
                // setTakeImgAdjust(true)
                setUploadModel(true)
            }

        }
    }, [file])




    console.log('photoFile', photoFile)
    console.log('File', file)
    return (
        <>
            {viewModel && (
                <div className={`fixed top-0 left-0 w-[100vw] h-[100vh] z-[9999] cursor-default`} >
                    <div className="w-full px-[18px] flex justify-between items-center py-[12px] bg-white">
                        <div className="w-auto flex items-center">
                            <div className="icon w-[40px] h-[40px] ms-[15px] me-[13px] rounded-full overflow-hidden">
                                <img src={profilePic} className='w-full h-full object-cover' alt="" />
                            </div>
                            <div className="content">
                                <span className='text-[17px]'>Me</span>
                            </div>
                        </div>

                        <div className="close pe-[15px]">
                            <button onClick={(e) => closeViewPhoto(e)} className='text-[30px] text-[#54656F]'>
                                <MdClose />
                            </button>
                        </div>
                    </div>



                    <div onClick={(e) => closeViewPhoto(e)} className="w-full h-[calc(100%-64px)]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                        <div className="w-full h-full flex justify-center items-center">
                            <div className={`overflow-hidden`}
                                style={{
                                    position: ok ? 'static' : 'absolute',
                                    borderRadius: ok ? '0%' : '50%',
                                    width: ok ? `${height - 84}px` : '200px',
                                    height: ok ? `${height - 84}px` : '200px',
                                    left: ok ? 'auto' : `${containerReact?.left}px`,
                                    top: ok ? 'auto' : `${containerReact?.top}px`,
                                    transition: 'all .15s'
                                }}>

                                <img src={profilePic} className='w-full h-full object-cover' alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {takeModel &&
                <div style={{ backgroundColor: 'rgba(255, 255, 255, .80' }} className="model-back fixed z-[9999] w-full h-full left-0 top-0">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="model top-[50%] left-[50%] rounded w-[500px] bg-[white]" style={{ boxShadow: '0 17px 50px 0 rgba(11, 20, 26, .19), 0 12px 15px 0 rgba(11, 20, 26, .24)' }}>
                            <div className="w-full flex justify-between ps-[25px] py-[15px] pe-[20px] bg-[#008069]">
                                <div className="cancel flex items-center">
                                    <button onClick={() => closeTakePhoto()} className=' text-[#B3D9D2] font-bold pe-[24px] text-[22px]'>
                                        <RxCross2 strokeWidth={'1'} />
                                    </button>
                                    <span className='text-[#fff] font-medium text-[19px]'>Take photo</span>
                                </div>
                            </div>

                            {/* {!updateTakePhoto && */}
                            <div className="w-full h-[350px] flex items-center bg-[#000]">
                                <div className="w-full flex justify-end ">
                                    <video ref={videoRef} autoPlay playsInline />
                                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                </div>
                            </div>
                            {/* // } */}
                            {/* {updateTakePhoto &&
                                <div className="w-full h-[350px] flex items-center overflow-hidden relative cursor-move">

                                    <div className="absolute z-[999] right-[10px] top-[50%] translate-y-[-50%]">
                                        <div className="flex flex-col gap-3 bg-white p-1 py-[5px] text-[17px] items-center text-[#8696a0]">
                                            <button onClick={() => handleZoom(1.1)}>
                                                <FaPlus />
                                            </button>
                                            <button onClick={() => handleZoom(0.9)}>
                                                <FaMinus />
                                            </button>
                                        </div>
                                    </div>
                                    <canvas
                                        ref={canvasImgRef}
                                        className="w-full h-full object-cover"
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                    ></canvas>
                                    <canvas
                                        className="absolute top-0 left-0 w-full opacity-[0.6] h-full pointer-events-none"
                                        ref={(canvas) => drawCircularMask(canvas)}
                                    ></canvas>
                                </div>
                            } */}

                            {/* {photoFile && (
                                <div>
                                    <p>Photo taken! File: {photoFile.name}</p>
                                    <a href={URL.createObjectURL(photoFile)} download="photo.jpg">
                                        Download Photo
                                    </a>
                                </div>
                            )} */}
                            <div className="w-full bg-[#F0F2F5] py-[20px]">
                                <div className="w-full flex justify-end">
                                    <div className="flex justify-center w-full gap-4">
                                        <button onClick={() => handleTakePhoto(profile._id)} className="w-[60px] h-[60px] bg-[#00a884] rounded-full mt-[-20px] translate-y-[-50%] flex justify-center items-center text-white">
                                            <span>
                                                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>camera</title><path fill="currentColor" d="M21.317,4.381H10.971L9.078,2.45C8.832,2.199,8.342,1.993,7.989,1.993H4.905 c-0.352,0-0.837,0.211-1.078,0.468L1.201,5.272C0.96,5.529,0.763,6.028,0.763,6.38v1.878c0,0.003-0.002,0.007-0.002,0.01v11.189 c0,1.061,0.86,1.921,1.921,1.921h18.634c1.061,0,1.921-0.86,1.921-1.921V6.302C23.238,5.241,22.378,4.381,21.317,4.381z  M12.076,18.51c-3.08,0-5.577-2.497-5.577-5.577s2.497-5.577,5.577-5.577s5.577,2.497,5.577,5.577 C17.654,16.013,15.157,18.51,12.076,18.51z M12.076,9.004c-2.17,0-3.929,1.759-3.929,3.929s1.759,3.929,3.929,3.929 s3.929-1.759,3.929-3.929C16.004,10.763,14.245,9.004,12.076,9.004z"></path></svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* {takeImgAdjust &&
                <div style={{ backgroundColor: 'rgba(255, 255, 255, .80)' }} className="model-back fixed z-[9999] w-full h-full left-0 top-0">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="model top-[50%] left-[50%] rounded w-[500px] bg-[white]" style={{ boxShadow: '0 17px 50px 0 rgba(11, 20, 26, .19), 0 12px 15px 0 rgba(11, 20, 26, .24)' }}>
                            <div className="w-full flex justify-between ps-[25px] py-[15px] pe-[20px] bg-[#008069]">
                                <div className="cancel flex items-center">
                                    <button onClick={closePopup} className='text-[#B3D9D2] font-bold pe-[24px] text-[22px]'>
                                        <RxCross2 strokeWidth={'1'} />
                                    </button>
                                    <span className='text-[#fff] font-medium text-[19px]'>Drag the image to adjust</span>
                                </div>
                            </div>

                            <div className="w-full h-[350px] flex items-center overflow-hidden relative cursor-move">

                                <div className="absolute z-[999] right-[10px] top-[50%] translate-y-[-50%]">
                                    <div className="flex flex-col gap-3 bg-white p-1 py-[5px] text-[17px] items-center text-[#8696a0]">
                                        <button onClick={() => handleZoom(1.1)}>
                                            <FaPlus />
                                        </button>
                                        <button onClick={() => handleZoom(0.9)}>
                                            <FaMinus />
                                        </button>
                                    </div>
                                </div>
                                <canvas
                                    ref={canvasImgRef}
                                    className="w-full h-full object-cover"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                ></canvas>
                                <canvas
                                    className="absolute top-0 left-0 w-full opacity-[0.6] h-full pointer-events-none"
                                    ref={(canvas) => drawCircularMask(canvas)}
                                ></canvas>
                            </div>
                            <div className="w-full bg-[#F0F2F5] py-[20px]">
                                <div className="w-full flex justify-end">
                                    <div className="flex justify-end w-full gap-4">
                                        <div className="w-[60px] h-[60px] me-[40px] bg-[#00a884] rounded-full mt-[-20px] translate-y-[-50%] flex justify-center items-center text-white">
                                            <button onClick={handleSubmit}>
                                                <svg viewBox="0 0 30 30" height="30" width="30" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enable-background="new 0 0 30 30"><title>checkmark-large</title><path fill="currentColor" d="M9.9,21.25l-6.7-6.7L1,16.75l8.9,8.9L29,6.55l-2.2-2.2L9.9,21.25z"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            } */}

            {uploadModel &&
                <div style={{ backgroundColor: 'rgba(255, 255, 255, .80)' }} className="model-back fixed z-[9999] w-full h-full left-0 top-0">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="model top-[50%] left-[50%] rounded w-[500px] bg-[white]" style={{ boxShadow: '0 17px 50px 0 rgba(11, 20, 26, .19), 0 12px 15px 0 rgba(11, 20, 26, .24)' }}>
                            <div className="w-full flex justify-between ps-[25px] py-[15px] pe-[20px] bg-[#008069]">
                                <div className="cancel flex items-center">
                                    <button onClick={closePopup} className='text-[#B3D9D2] font-bold pe-[24px] text-[22px]'>
                                        <RxCross2 strokeWidth={'1'} />
                                    </button>
                                    <span className='text-[#fff] font-medium text-[19px]'>Drag the image to adjust</span>
                                </div>

                                {takeImgAdjust &&
                                    <button onClick={openUploadModel} className='text-[#fff] text-[22px]'>
                                        <span className="text-[26px] flex items-center">
                                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px"><title>return</title><path fill="currentColor" d="M19.77,11.73c0,1.64-0.5,2.95-1.48,3.89c-1.38,1.32-3.26,1.41-3.75,1.41c-0.07,0-0.11,0-0.12,0l-5.41,0v-2.1 h5.46c0.05,0,1.47,0.04,2.38-0.84c0.55-0.53,0.82-1.32,0.82-2.37c0-1.27-0.33-2.23-0.99-2.84c-0.98-0.92-2.43-0.85-2.44-0.85 l-4.23,0v3.1L4,7.07L10.01,3v2.93h4.16c0.03,0,2.29-0.13,3.95,1.42C19.21,8.38,19.77,9.85,19.77,11.73z"></path></svg>
                                            <span className='text-[14px] pt-[8px]' style={{ paddingLeft: '5px' }}>
                                                Upload
                                            </span>
                                        </span>
                                    </button>
                                }

                            </div>

                            <div className="w-full h-[350px] flex items-center overflow-hidden relative cursor-move">

                                <div className="absolute z-[999] right-[10px] top-[50%] translate-y-[-50%]">
                                    <div className="flex flex-col gap-3 bg-white p-1 py-[5px] text-[17px] items-center text-[#8696a0]">
                                        <button onClick={() => handleZoom(1.1)}>
                                            <FaPlus />
                                        </button>
                                        <button onClick={() => handleZoom(0.9)}>
                                            <FaMinus />
                                        </button>
                                    </div>
                                </div>
                                <canvas
                                    ref={canvasImgRef}
                                    className="w-full h-full object-cover"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                ></canvas>
                                <canvas
                                    className="absolute top-0 left-0 w-full opacity-[0.6] h-full pointer-events-none"
                                    ref={(canvas) => drawCircularMask(canvas)}
                                ></canvas>
                            </div>
                            <div className="w-full bg-[#F0F2F5] py-[20px]">
                                <div className="w-full flex justify-end">
                                    <div className="flex justify-end w-full gap-4">
                                        <div className="w-[60px] h-[60px] me-[40px] bg-[#00a884] rounded-full mt-[-20px] translate-y-[-50%] flex justify-center items-center text-white">
                                            <button onClick={handleSubmit}>
                                                <svg viewBox="0 0 30 30" height="30" width="30" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enable-background="new 0 0 30 30"><title>checkmark-large</title><path fill="currentColor" d="M9.9,21.25l-6.7-6.7L1,16.75l8.9,8.9L29,6.55l-2.2-2.2L9.9,21.25z"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {openModal &&
                <div style={{ backgroundColor: 'rgba(255, 255, 255, .80' }} className="model-back fixed z-[9999] w-full h-full left-0 top-0">
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="model top-[50%] left-[50%] pt-[12px] px-[24px] pb-[20px] rounded w-[500px] bg-[white]" style={{ boxShadow: '0 17px 50px 0 rgba(11, 20, 26, .19), 0 12px 15px 0 rgba(11, 20, 26, .24)' }}>
                            <div className="w-full flex justify-between pe-[5px] pt-[10px]">
                                <div className="w-auto flex items-center">
                                    <span className='text-[#3B4A54] text-[14px]'>Remove your profile photo?</span>
                                </div>
                            </div>
                            <div className="w-full pt-[50px] px-[5px]">
                                <div className="w-full flex justify-end">
                                    <div className="flex gap-4">

                                        <button onClick={() => openRemovePhotoModel()} className='py-[7px] px-[21px] text-[#008069] font-medium border-[#e9edef] border rounded-full text-[13px]'>Cancel</button>

                                        {/* { */}
                                        {/* // type === 'sender' && */}
                                        <button onClick={() => removeProfilePhoto(profile?.profile?._id)} className='bg-[#008069] text-[white] font-medium py-[7px] px-[21px] border-[#e9edef] border rounded-full text-[13px]'>Remove</button>
                                        {/* } */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }


            <div className={`absolute top-0 left-0 w-full h-full z-[9998] opacity-[${scale}]`} style={{ visibility: `${scale == '1' ? 'visible' : 'hidden'}`, scale: `${scale}`, width: `${100}%`, transition: '.2s', transformOrigin: 'left top' }}>
                <div className="h-[107px] bg-[#008069] pb-[10px] px-[20px]">
                    <div className="titals flex flex-col justify-end h-full">
                        <div className="w-full flex items-center">
                            <div className="arrow flex items-center text-white">
                                <button onClick={() => closeProfile()}>
                                    <div className='text-[40px]'>
                                        <RiArrowLeftSLine />
                                    </div>
                                </button>
                            </div>
                            <div className="ps-4 text-[20px] font-medium text-white">
                                <h2>Profile</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-[calc(100%-107px)] bg-[#f0f2f5] overflow-y-scroll overflow-x-hidden">
                    <div className="w-full py-[28px]">
                        <div className="w-full flex justify-center">



                            <div className="relative w-[200px] h-[200px]">
                                <input className='hidden' onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} name="profilepic" />


                                <div className="profile-pic w-full h-full relative  rounded-full" ref={containerRef}>
                                    <div className='pro-menu-hover absolute w-full h-full z-[999] opacity-0' style={
                                        { visibility: 'hidden' }
                                    }>
                                        <div className={`w-[178px] absolute z-[9999] rounded-md bg-white py-[9px] opacity-[${modelScale ? '1' : '0'}]`} style={{ scale: `${modelScale ? '1' : '0'}`, top: `${topPosition}px`, left: `${leftPosition}px`, transformOrigin: 'left top', transition: '.2s', visibility: `${modelScale ? 'visible' : 'hidden'}` }} >
                                            <ul className='w-full'>
                                                <li className='w-full'>
                                                    <button onClick={(e) => viewPhoto()} className='w-full flex justify-start ps-[24px] text-[14px] text-[#3b4a54] py-[10px] hover:bg-[#f5f6f6]'>
                                                        View Photo
                                                    </button>
                                                </li>
                                                <li className='w-full'>
                                                    <button onClick={(e) => openTakeModel(e)} className='w-full flex justify-start ps-[24px] text-[14px] text-[#3b4a54] py-[10px] hover:bg-[#f5f6f6]'>
                                                        Take photo
                                                    </button>
                                                </li>
                                                <li className='w-full'>
                                                    <button onClick={(e) => openUploadModel(e)} className='w-full flex justify-start ps-[24px] text-[14px] text-[#3b4a54] py-[10px] hover:bg-[#f5f6f6]'>
                                                        Upload Photo
                                                    </button>
                                                </li>
                                                <li className='w-full'>
                                                    <button onClick={(e) => openRemovePhotoModel(e)} className='w-full flex justify-start ps-[24px] text-[14px] text-[#3b4a54] py-[10px] hover:bg-[#f5f6f6]'>
                                                        Remove Photo
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        <button onClick={(e) => openMenu(e)} className="box w-full h-full rounded-full" style={{ background: 'rgba(84, 101, 111, .8)' }}>
                                            <div className="w-full h-full flex flex-col justify-center items-center">
                                                <span>
                                                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="text-white text-[20px] mt-[10px]" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>camera</title><path fill="currentColor" d="M21.317,4.381H10.971L9.078,2.45C8.832,2.199,8.342,1.993,7.989,1.993H4.905 c-0.352,0-0.837,0.211-1.078,0.468L1.201,5.272C0.96,5.529,0.763,6.028,0.763,6.38v1.878c0,0.003-0.002,0.007-0.002,0.01v11.189 c0,1.061,0.86,1.921,1.921,1.921h18.634c1.061,0,1.921-0.86,1.921-1.921V6.302C23.238,5.241,22.378,4.381,21.317,4.381z  M12.076,18.51c-3.08,0-5.577-2.497-5.577-5.577s2.497-5.577,5.577-5.577s5.577,2.497,5.577,5.577 C17.654,16.013,15.157,18.51,12.076,18.51z M12.076,9.004c-2.17,0-3.929,1.759-3.929,3.929s1.759,3.929,3.929,3.929 s3.929-1.759,3.929-3.929C16.004,10.763,14.245,9.004,12.076,9.004z"></path></svg>
                                                </span>
                                                <span className='text-center text-[14px] mt-[10px] text-white' style={{ lineHeight: '1.15' }}>
                                                    CHANGE <br /> PROFILE PHOTO
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                    <img src={profilePic} className='w-full h-full object-cover rounded-full' alt="" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-white px-[30px] pt-[14px] pb-[10px] mb-[10px]">
                        <div className="flex flex-col gap-y-4">
                            <div className="w-full">
                                <span className='text-[#008069] text-[14px]'>Your Name</span>
                            </div>



                            {/* //helloo */}
                            {editName ?
                                <div className="w-full">
                                    <div className="w-full flex justify-between">
                                        <div class="w-full flex items-center max-w-lg mx-auto">
                                            <div class="relative w-full flex">
                                                <input
                                                    type="text"
                                                    ref={nameRef}
                                                    autoFocus
                                                    className={`w-full border-b-2 outline-none pb-1`}
                                                    style={{
                                                        borderBottomColor: nameRef.current && nameRef.current === document.activeElement ? '#00a884' : '#667781',
                                                        transition: 'border-bottom-color 0.3s ease'
                                                    }}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value.length <= 25) {
                                                            setUpdateName(value);
                                                        }
                                                    }}
                                                    value={updateName.length <= 25 ? updateName : ''}
                                                    onFocus={() => {
                                                        nameRef.current.style.borderBottomColor = '#00a884'; // Set border color on focus
                                                    }}
                                                    onBlur={() => {
                                                        nameRef.current.style.borderBottomColor = '#667781'; // Set border color on blur
                                                    }}
                                                />
                                                <div className="w-auto flex gap-1 items-center absolute right-0">
                                                    <span className='text-[#8696a0] text-[14px] pe-1 opacity-[0.5]'>
                                                        {25 - (Math.min(updateName.length, 25))}
                                                    </span>
                                                    <button type="button" className="">
                                                        <svg viewBox="0 0 20 20" height="20" width="20" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 20 20"><title>emoji-input</title><path fill="#8696a0" d="M9.5,1.7C4.8,1.7,1,5.5,1,10.2s3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5S14.2,1.7,9.5,1.7z  M9.5,17.6c-4.1,0-7.4-3.3-7.4-7.4s3.3-7.4,7.4-7.4s7.4,3.3,7.4,7.4S13.6,17.6,9.5,17.6z"></path><path fill="#8696a0" d="M6.8,9.8C7.5,9.7,8,9.1,7.9,8.4C7.8,7.8,7.4,7.3,6.8,7.3C6.1,7.3,5.6,8,5.7,8.7 C5.7,9.3,6.2,9.7,6.8,9.8z"></path><path fill="#8696a0" d="M13.9,11.6c-1.4,0.2-2.9,0.3-4.4,0.4c-1.5,0-2.9-0.1-4.4-0.4c-0.2,0-0.4,0.1-0.4,0.3 c0,0.1,0,0.2,0,0.2c0.9,1.8,2.7,2.9,4.7,3c2-0.1,3.8-1.2,4.8-3c0.1-0.2,0-0.4-0.1-0.5C14.1,11.6,14,11.6,13.9,11.6z M9.8,13.6 c-2.3,0-3.5-0.8-3.7-1.4c2.3,0.4,4.6,0.4,6.9,0C13,12.3,12.6,13.6,9.8,13.6L9.8,13.6z"></path><path fill="#8696a0" d="M12.2,9.8c0.7-0.1,1.2-0.7,1.1-1.4c-0.1-0.6-0.5-1.1-1.1-1.1c-0.7,0-1.2,0.7-1.1,1.4 C11.2,9.3,11.6,9.7,12.2,9.8z"></path></svg>
                                                    </button>
                                                    <button type="button" style={{ transition: '.2s' }} className={slideRight ? 'translate-x-[50%]' : ''} onClick={() => { setTimeout(() => {
                                                        setEditName(false)
                                                    }, 300), setUpdateName(proUsername), setSlideRight(true), updateProfileById(profile.profile._id, {username : updateName}); }}>
                                                        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>checkmark</title><path fill="#8696a0" d="M9,17.2l-4-4l-1.4,1.3L9,19.9L20.4,8.5L19,7.1L9,17.2z"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="w-full">
                                    <div className="w-full flex justify-between">
                                        <span className='text-[15px]'>
                                            {proUsername}
                                        </span>
                                        <div className="edit">
                                            <button className='text-[#8696a0] text-[21px]' onClick={() => { setEditName(true), setSlideRight(false), setTimeout(() => { nameRef.current.focus(), nameRef.current.style.borderBottomColor = '#00a884' }, 0) }}>
                                                <RiPencilFill />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }




                        </div>
                    </div>


                    <div className="w-full px-[30px] pt-[4px] pb-[10px] mb-[10px]">
                        <div className="flex flex-col gap-y-4">
                            <div className="w-full">
                                <div className="w-full flex justify-between">
                                    <span className="text-[13px] text-[#54656f]">
                                        This is not your username or PIN. This name will be visible to your WhatsApp contacts.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-white px-[30px] pt-[14px] pb-[10px] mb-[10px]">
                        <div className="flex flex-col gap-y-4">
                            <div className="w-full">
                                <span className='text-[#008069] text-[14px]'>About</span>
                            </div>
                            <div className="w-full">
                                <div className="w-full flex justify-between">
                                    <span className='text-[15px]'>Always Happy 😊</span>

                                    <div className="edit">
                                        <button className='text-[#8696a0] text-[21px]'>
                                            <RiPencilFill />
                                        </button>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default ProfileUpdate
