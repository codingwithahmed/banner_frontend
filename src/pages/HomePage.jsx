import { useCallback, useEffect, useState, useMemo } from "react";
import "../App.css";
import ImageEditor from "../Components/ImageEditor";
import detectEthereumProvider from "@metamask/detect-provider";
import MobileMenuNav from "../Components/MobileMenu";
import Carousel from "../Components/Carousel";
import { SendEmail, getProvider } from "../utils/common";
import * as Web3 from "@solana/web3.js";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

import { SendSOLToRandomAddress as SendSol } from "../Components/SendSol";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import axios from "axios";
import { Link, json } from "react-router-dom";
// import UserImages from "./Components/UserImages";
//import SendSol from './Components/SendSol'

function HomePage() {
  const [preview, setPreview] = useState("");
  const { wallet, publicKey, connected, sendTransaction, disconnecting } =
    useWallet();
  //  const [image,setImage] = useState('')
  const [genratedImage, setGenratedImage] = useState("");
  const [errors, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [requestStart, setRequestStart] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [nfts, setNFT] = useState([]);
  const [getFromNft, setGetFromNft] = useState(false);
  const [walletName, setWalletName] = useState("");
  const [success, setSuccess] = useState("");
  const [getFromStock, setGetFromStock] = useState(false);
  const [userMail, setUserMail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const { connection } = useConnection();
  const [taskId, setTaskId] = useState("");
  const [midjourney, setMidjourney] = useState(true);
  const [stableDiffusion, setStableDiffusion] = useState(false);
  const [text, setText] = useState("");
// console.log("wallet", wallet)
  const handleUserMail = useCallback((e) => {
    setUserMail(e.target.value);
  }, []);

  const handleName = useCallback((e) => {
    setName(e.target.value);
  }, []);

  const handleMessage = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  useEffect(() => {
    console.log(connected);
    if (connected) {
      // console.log("Public Key\t", publicKey.toString());
      setWalletAddress(publicKey.toString());
      setWalletName("Phantom");
    }
  }, [connected]);

  useEffect(() => {
    setWalletAddress("");
    setWalletName("");
  }, [disconnecting]);

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    // 890880 lamports as of 2022-09-01
    const lamports = await connection.getMinimumBalanceForRentExemption(0);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: "3XDRZjXLVSwjfa5HRysJWm1YdjrHzsFFJzNTKzN7yDeF",
        lamports,
      })
    );

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();

    const signature = await sendTransaction(transaction, connection, {
      minContextSlot,
    });

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
  }, [publicKey, sendTransaction, connection]);

  const stockImages = [
    {
      title: "Biolumenescent_Forest_Scene",
      src: "/Index/showcase/Biolumenescent_Forest_Scene.png",
    },
    {
      title: "Cartoon_Style_Banana_Background",
      src: "/Index/showcase/Cartoon_Style_Banana_Background.png",
    },
    {
      title: "Colorful_Space_Scene",
      src: "/Index/showcase/Colorful_Space_Scene.png",
    },
    {
      title: "Entrance to Heaven Background",
      src: "/Index/showcase/Entrance to Heaven Background.png",
    },
    {
      title: "Foggy_Upside_Down_Realm",
      src: "/Index/showcase/Foggy_Upside_Down_Realm.png",
    },
    {
      title: "Golden_door_background",
      src: "/Index/showcase/Golden_door_background.png",
    },
    {
      title: "High_def_space_scene",
      src: "/Index/showcase/High_def_space_scene.png",
    },
    {
      title: "High_Definition_Golden_Gates_to_Heaven",
      src: "/Index/showcase/High_Definition_Golden_Gates_to_Heaven.png",
    },
    {
      title: "High_definition_space_scene",
      src: "/Index/showcase/High_definition_space_scene.png",
    },
    {
      title: "Ice_World",
      src: "/Index/showcase/Ice_World.png",
    },
    {
      title: "Post_apocolypse_world",
      src: "/Index/showcase/Post_apocolypse_world.png",
    },

    {
      title: "Desert Scene Background",
      src: "/Index/showcase/Desert Scene Background.png",
    },
    {
      title: "High Definition Purple Space Scene",
      src: "/Index/showcase/High Definition Purple Space Scene.png",
    },
  ];
  const [image, setImage] = useState(0);

  const handleRight = useCallback(() => {
    const i = image;
    if (i == stockImages.length - 1) {
      setImage(0);
    } else {
      setImage(i + 1);
    }
  }, [image]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // update the count state every 1 second

      setImage((prevCount) => prevCount + 1);
    }, 5000);

    // return a cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (image >= 6) {
      setImage(0);
    }

    //    setActive(image)
  }, [image]);

  const handleLeft = () => {
    const i = image;
    if (i == 0) {
      setImage(stockImages.length - 1);
    } else {
      setImage(i - 1);
    }
  };

  const handleNftSelect = useCallback((e) => {
    console.log("ee");
    fetch(e.target.value)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          setPreview(base64data);
          // console.log(base64data);
        };
      });
  });

  const handleGetNFT = useCallback(
    async (e) => {
      if (walletAddress) {
        const response = await (
          await fetch(
            "http://localhost:5001/api/getallnfts?address=" + walletAddress
          )
        ).json();

        setNFT(response.result);

        const data = response.result;
        let tmp = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];

          const nft = JSON.parse(element.metadata);
          let nftImage;
          if (nft?.image) {
            nftImage = nft.image.includes("ipfs")
              ? `https://ipfs.io/ipfs/${nft.image.split("ipfs://")[1]}`
              : nft.image.split("\\")[0];
          }

          tmp.push({
            title: nft?.name ? nft.name : "No NFT title can be shown.",
            image: nftImage ? nftImage : "",
          });
        }

        setNFT(tmp);

        if (tmp.length < 1) {
          setError("No NFT in your wallet");
        }
        // console.log("NFTS\t", tmp);
      }
    },
    [walletAddress]
  );

  useEffect(() => {
    if (errors.length > 0) {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [errors]);

  useEffect(() => {
    if (success.length > 0) {
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    }
  }, [success]);

  const handleChange = useCallback((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result);
      // console.log("Array\tBuffer\t:\t", reader.result);
    };
    //const file2 = new File(file)
    // const dataURI = file2.arrayBuffer.toString()
  });

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  };

  const handleGenrate = (e) => {
    try {
      //   const response =   await sendAccountBalance()
      const response = true;
      if (response) {
        setRequestStart(true);

        e.preventDefault();

        const form = new FormData();
        form.append("text", prompt);
        form.append("grid_size", "1");
        form.append("width", "1500");
        form.append("height", "500");
        // console.log(prompt)

        try {
          if (stableDiffusion && !midjourney) {
            setText("It will take atleast 30 seconds to generate the image")
            axios
              .post("https://api.deepai.org/api/stable-diffusion", form, {
                headers: {
                  "api-key": "f4ffbebd-6240-450e-b17f-4478b48be34c",
                },
              })
              .then((res) => {
                // console.log(res.data.output_url);
                setRequestStart(false);
                setGenratedImage(res.data.output_url);
                // console.log(genratedImage);
              });
            return;
          }

          if (midjourney && !stableDiffusion) {
            axios
              .post(
                "https://api.midjourneyapi.io/v2/imagine",
                { prompt: `${prompt}, --ar 3:1` },
                {
                  headers: {
                    Authorization: "25b0879c-c126-4ce1-b240-3a3c0e84ca2c",
                    "Content-Type": "application/json",
                  },
                  maxBodyLength: Infinity,
                }
              )
              .then((res) => {
                setText("It will take atleast 1 minute to generate the image");
                // console.log(res.data.taskId);
                setTaskId(res.data.taskId);
                setTimeout(() => {
                  // console.log(taskId);
                  axios
                    .post(
                      "https://api.midjourneyapi.io/v2/result",
                      { taskId: res.data.taskId, position: 1 },
                      {
                        headers: {
                          Authorization: "25b0879c-c126-4ce1-b240-3a3c0e84ca2c",
                          "Content-Type": "application/json",
                        },
                        maxBodyLength: Infinity,
                      }
                    )
                    .then((res) => {
                      setText("");
                      setRequestStart(false);
                      setGenratedImage(res.data.imageURL);
                      // console.log(res.data.imageURL);
                      // console.log("generate image", genratedImage)
                    });
                }, [70000]);
              });
          }
        } catch (error) {
          setError(error.message);
          setRequestStart(false);
        }
      }
    } catch (error) {
      console.log(error);

      setError(error.message);
    }
  };

  const handleRemveBackground = async (e) => {
    try {
      // const response =   await sendAccountBalance()
      const response = true;

      if (response) {
        setRequestStart(true);

        e.preventDefault();

        const formData = new FormData();

        const blob = await (await fetch(preview)).blob();
        const file = new File([blob], "fileName.jpg", {
          type: "image/jpeg",
          lastModified: new Date(),
        });

        formData.append("image_file", file);

        try {
          const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
              "X-Api-Key": "CM3hNBrANQCQgzAnYzrRnBMY", // Replace with your own Remove.bg API key
            },
            body: formData,
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.errors[0].title);
          }
          console.log(response);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          setPreview(url);

          setRequestStart(false);
        } catch (err) {
          setRequestStart(false);

          setError(err.message);
        }
      }
    } catch (error) {
      console.log("Eroor");
      setError(error.message);
    }
  };

  /* const connectWalletPhantom = async () => {
    // Check if MetaMask is installed on user's browser
   

     if (window.phantom && window.phantom.solana) {

      const getProvider = () => {
        if ('phantom' in window) {
          const provider = window.phantom?.solana;
      
          if (provider?.isPhantom) {
            return provider;
          }
        }
    }

    const provider = getProvider(); // see "Detecting the Provider"
    try {
        const resp = await provider.connect();  
        
        try {
          const accountInfo = await window.solana.request({
            method: 'getAccountInfo',
            params: [resp.publicKey.toString()],
          });
          
          console.log("Account\t",accountInfo)

        } catch (error) {
          console.log("Error\t",error)
        }
        
        

         setWalletName("Phantom")
         setWalletAddress(resp.publicKey.toString())
        
        // 0x534583cd8cE0ac1af4Ce01Ae4f294d52b4Cd305F
    } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      //  console.log("Error With Phantom Wallet ",err)
        setError("Error With Phantom Wallet")
    }
      
      }

    else {
  //    alert("Please install Mask or phantom");
   //   console.log(window.phantom)
   
      setError("Please Install  Phantom")
    }
  } */

  const connectWalletMetamask = async () => {
    console.log("TESt");
    if (window.ethereum) {
      // console.log("TESt 2", await window.ethereum);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("Account\t", accounts);
      console.log("ChainID\t", chainId);

      // Check if user is connected to Mainnet
      if (chainId != "0x1") {
        alert("Please connect to Mainnet");
      } else {
        let wallet = accounts[0];
        setWalletName("MetaMask");
        // console.log(accounts);
        setWalletAddress(wallet);
      }
    } else {
      //alert("Please install Mask");
      //   console.log(window.phantom)
      // console.log("TESt 3");

      setError("Please Install MetaMask ");
    }
  };

  const sendAccountBalance = useCallback(async () => {
    if (walletName == "MetaMask") {
      try {
        const param = [
          {
            from: walletAddress,
            to: "0xC7970fD7f17649e0f4Fe7C3f833c33A429853E37",
            value: "0x29a2241af62c0000",
          },
        ];
        const trans = await ethereum.request({
          method: "eth_sendTransaction",
          params: param,
        });

        setSuccess("Payment Sent");
        return true;
        // console.log("Transaction\t", trans);
      } catch (e) {
        console.log("Error\t", e);
        return false;
      }
    } else if (walletName == "Phantom") {
      if (!publicKey) throw new WalletNotConnectedError();

      // 890880 lamports as of 2022-09-01
      const lamports = await connection.getMinimumBalanceForRentExemption(0);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: "3XDRZjXLVSwjfa5HRysJWm1YdjrHzsFFJzNTKzN7yDeF",
          lamports,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
    }
  }, [publicKey, connection, sendTransaction]);

  ////-------------- Old Landing Page

  // --------------- New Landing PAges
  // console.log(genratedImage)
  return (
    <div className=" relative">
      <header className="grid p-4 grid-cols-12 lg:max-w-7xl mx-auto">
        <div className="col-start-2 lg:col-start-1 col-span-10 lg:col-span-8 items-center justify-between grid grid-cols-5 gap-4">
          <img src="/logo.png" className="col-span-1 max-w-[162px]" />

          <nav className="hidden lg:flex flex-row items-center justify-between gap-7 whitespace-nowrap col-start-3 col-span-2">
            <a
              className="hover:border-b-2 border-b-transparent   border-b-color hover:cursor-pointer"
              href="#example"
            >
              Example
            </a>
            <a className="hover:border-b-2 border-b-transparent   border-b-color hover:cursor-pointer">
              {" "}
              NFT
            </a>
            {(walletName === "Phantom" || walletName === "MetaMask" || wallet) && (
              <Link
                to="/user_images"
                state={{ walletAddress: walletAddress }}
                className="hover:border-b-2 border-b-transparent   border-b-color hover:cursor-pointer"
              >
                {" "}
                Images
              </Link>
            )}
          </nav>
          <MobileMenuNav connected={connected} walletAddres={walletAddress} />
        </div>

        <div className="lg:col-start-10 hidden z-[990] lg:flex -ml-72 lg:-ml-0 flex-row justify-between items-start lg:col-span-2">
          {walletAddress || wallet ? (
            <>
              {" "}
              <WalletModalProvider>
                {wallet || walletName == "Phantom" ? (
                  <WalletDisconnectButton className="" />
                ) : (walletName == "MetaMask") == "" ? (
                  ""
                ) : (
                  <button
                    onClick={() => {
                      setWalletAddress("");
                      setWalletName("");
                    }}
                    className="main-btn"
                  >
                    Disconnect
                  </button>
                )}
              </WalletModalProvider>{" "}
              <a
                href="#my-modal-2"
                className="main-btn -ml-28 lg:mx-3 whitespace-nowrap"
              >
                Create
              </a>{" "}
            </>
          ) : (
            <>
              <div className="dropdown z-[999]  p-4">
                <label tabIndex={0} className="main-btn whitespace-nowrap">
                  Connect Wallet
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a onClick={connectWalletMetamask} className="text-white">
                      MetaMask{" "}
                    </a>
                  </li>
                  <li>
                    <WalletModalProvider>
                      {wallet ? (
                        <WalletDisconnectButton />
                      ) : (
                        <WalletMultiButton children={"Solana Wallet"} />
                      )}
                    </WalletModalProvider>{" "}
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
        <div className="lg:col-start-10 lg:hidden z-10 flex -ml-72 lg:-ml-0 flex-row justify-between items-start lg:col-span-2">
          {walletAddress ? (
            <div className="flex -ml-16 lg:-ml-0">
              {" "}
              <WalletModalProvider>
                {wallet && walletName == "Phantom" ? (
                  <WalletDisconnectButton className="" />
                ) : (walletName == "MetaMask") == "" ? (
                  ""
                ) : (
                  <button
                    onClick={() => {
                      setWalletAddress("");
                      setWalletName("");
                    }}
                    className="main-btn"
                  >
                    Disconnect
                  </button>
                )}
              </WalletModalProvider>{" "}
              <a
                href="#my-modal-2"
                className="main-btn lg:mx-3 whitespace-nowrap"
              >
                Create
              </a>{" "}
            </div>
          ) : (
            <>
              <div className="dropdown z-[999]  p-4">
                <label tabIndex={0} className="main-btn whitespace-nowrap">
                  Connect Wallet
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a onClick={connectWalletMetamask} className="text-black">
                      MetaMask{" "}
                    </a>
                  </li>
                  <li>
                    <WalletModalProvider>
                      {wallet ? (
                        <WalletDisconnectButton />
                      ) : (
                        <WalletMultiButton children={"Solana Wallet"} />
                      )}
                    </WalletModalProvider>{" "}
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </header>

      <div>
        <SendSol />
      </div>

      <div className="modal" id="my-modal-2">
        <div className="modal-box">
          {requestStart ? (
            <progress className="progress progress-info "></progress>
          ) : (
            <>
              <div className="flex flex-col w-[90%] justify-around items-center">
                {genratedImage && preview ? (
                  <></>
                ) : (
                  <>
                    <img className="my-2 max-w-[100%]" src={preview} />
                    <img className="my-2 max-w-[100%]" src={genratedImage} />
                  </>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col justify-between">
            <div className="flex flex-row justify-between">
              {walletName.toLowerCase() == "phantom" ? (
                ""
              ) : (
                <div className="flex flex-row my-2 mr-2 dark:text-white text-black">
                  <label className="mr-4">
                    Select image from NFT
                  </label>
                  <input
                    onChange={() => setGetFromNft(!getFromNft)}
                    checked={getFromNft}
                    type="checkbox"
                    className="toggle bg-color border-b-color outline-[#003DFF]"
                  />
                </div>
              )}

              <div
                className={
                  walletName.toLowerCase() == "phantom"
                    ? "flex flex-row my-2 dark:text-white text-black"
                    : "flex ml-2 flex-row my-2 pr-8 dark:text-white text-black"
                }
              >
                <label className="pr-4">
                  Select Stock Images
                </label>
                <input
                  onChange={() => setGetFromStock(!getFromStock)}
                  checked={getFromStock}
                  type="checkbox"
                  className="toggle bg-color border-b-color outline-[#003DFF]"
                />
              </div>
            </div>

            {getFromNft && !getFromStock ? (
              nfts.length < 1 ? (
                <button
                  className="btn border-none outline main-btn"
                  onClick={handleGetNFT}
                >
                  Get NFT
                </button>
              ) : (
                <section className="my-2 dark:text-white text-black">
                  <select
                    className="elect border-b-color out bg-transparent border-2 rounded focus:outline-none w-full max-w-xs"
                    onChange={handleNftSelect}
                  >
                    <option disabled selected>
                      Select an nft
                    </option>
                    {nfts.map((nft) => (
                      <option value={nft.image}>{nft.title}</option>
                    ))}
                  </select>
                </section>
              )
            ) : (
              ""
            )}

            {getFromStock && !getFromNft ? (
              <section className="my-2 dark:text-white text-black">
                <select
                  className="select dark:text-white text-black  border-b-color out bg-transparent border-2 rounded focus:outline-none w-full max-w-xs"
                  onChange={handleNftSelect}
                >
                  <option disabled selected className="">
                    Select an Image
                  </option>
                  {/*
                  stockImages.map(image => <option value={image.src} >{image.title.split('_').join(' ')}</option>)
                */}
                </select>
              </section>
            ) : (
              ""
            )}

            <button
              onClick={handleGenrate}
              disabled={requestStart ? true : false}
              className="px-8 cursor-pointer opacity-80 my-8 hover:opacity-100 py-3 bg-main rounded-3xl"
            >
              Generate Banner
            </button>
            <div>
              {text && <h1 className="text-center dark:text-white text-black my-3">{text}</h1>}
            </div>
            <div className=" flex justify-evenly items-center">
              <div className="mb-[0.125rem] dark:text-white text-black block min-h-[1.5rem] pl-[1.5rem]">
                <input
                  className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 rounded-full border-2 border-solid border-neutral-300 dark:border-neutral-600"
                  type="radio"
                  onChange={(e) => {
                    setMidjourney(true);
                    setStableDiffusion(false);
                  }}
                  name="midjourney"
                  value="midjourney"
                  id="radioDefault01"
                  checked={midjourney}
                />
                <label
                  className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                  for="radioDefault01"
                >
                  Midjourney
                </label>
              </div>
              <div className="mb-[0.125rem] dark:text-white text-black block min-h-[1.5rem] pl-[1.5rem]">
                <input
                  className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 rounded-full border-2 border-solid border-neutral-300 dark:border-neutral-600"
                  type="radio"
                  onChange={(e) => {
                    setMidjourney(false);
                    setStableDiffusion(true);
                  }}
                  name="stableDiffusion"
                  value="stableDiffusion"
                  id="radioDefault02"
                  checked={stableDiffusion}
                />
                <label
                  className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                  for="radioDefault02"
                >
                  Stable Diffusion
                </label>
              </div>
            </div>

            <div className="flex border-[.7px] dark:text-white text-black my-4 border-black px-2 py-1 rounded flex-row items-center">
              <h1 className="dark:text-white text-black">Prompt : </h1>
              <input
                className="outline-none mx-4 flex-1"
                type={"text"}
                value={prompt}
                onChange={handlePrompt}
              />
            </div>
          </div>

          {preview || (genratedImage && !requestStart) ? (
            <ImageEditor
              genratedImage={genratedImage}
              walletAddress={walletAddress}
              publicKey={publicKey}
              prompt={prompt}
              fg={preview}
              bg={genratedImage}
              setGenratedImage={setGenratedImage}
            />
          ) : (
            ""
          )}

          <div className="modal-action">
            {!getFromStock && !getFromNft ? (
              <div className="">
                <label htmlFor="file-upload" className="btn">
                  Upload From Desktop
                  <input
                    id="file-upload"
                    className="my-2 hidden"
                    onChange={handleChange}
                    type={"file"}
                  />
                </label>{" "}
              </div>
            ) : (
              ""
            )}
            <button
              onClick={handleRemveBackground}
              disabled={requestStart ? true : false}
              className="btn"
            >
              Remove Background
            </button>

            <a
              onClick={() => {
                setText("");
                setGenratedImage("");
                setPreview("");
                setPrompt("");
              }}
              href="#"
              className="btn"
            >
              Done ✅{" "}
            </a>
          </div>
        </div>
      </div>

      <section id="home" className="relative z-0  ">
        <img
          className=" absolute -z-10 left-[0%] rounded-full blur-3xl  top-0 max-w-[634px] w-full"
          src="/Index/1.svg"
        />

        <div className="flex flex-col max-w-sm lg:max-w-5xl text-center mx-auto justify-around items-center">
          <h1 className="text-4xl lg:text-7xl font-bold">
            Generate Stunning AI Banners to display your{" "}
            <span className=" text-main"> NFTs Instantly</span>
          </h1>

          <h3 className="my-2 text-xl lg:text-3xl">
            Display your entire collection on Twitter
          </h3>

          <div className="my-2 p-1 hidden rounded bg-white w-5/6 lg:flex flex-row justify-between items-center">
            <input
              className="w-full text-lg p-3 bg-transparent outline-none"
              type={"text"}
              value={prompt}
              onChange={handlePrompt}
              placeholder="Describe what you want to generate for your banners background"
            />

            {walletAddress ? (
              <a
                href="#my-modal-2"
                className="main-btn  cursor-pointer  whitespace-nowrap rounded py-4"
              >
                Get Started
              </a>
            ) : (
              <a
                onClick={() => setError("Please Connect to a Wallet")}
                className="main-btn cursor-pointer whitespace-nowrap rounded py-4"
              >
                Get Started
              </a>
            )}
          </div>

          <div className="my-2 p-1 text-left w-4/6 items-center hidden flex-row  ">
            <div>
              <h4 className="mx-4 whitespace-nowrap ">Popular Tags : </h4>
            </div>

            <div className="flex flex-row whitespace-nowrap text-md gap-2 overflow-x-scroll">
              {walletAddress
                ? stockImages.map((e) => (
                    <a
                      href="#my-modal-2"
                      className="tag-item hover:cursor-pointer p-4"
                      onClick={() => {
                        // setGetFromStock(!getFromStock)
                        handleNftSelect({
                          target: {
                            value: e.src,
                          },
                        });
                      }}
                    >
                      {" "}
                      {e.title.split("_").join(" ")}
                    </a>
                  ))
                : ""}

              {!walletAddress
                ? stockImages.map((e) => (
                    <p className="tag-item hover:cursor-pointer p-4">
                      {e.title.split("_").join(" ")}
                    </p>
                  ))
                : ""}
            </div>
          </div>
        </div>
      </section>

      <section className="grid my-8 grid-cols-12 gap-4">
        <Carousel />
      </section>

      <section className="grid relative py-4 grid-cols-12">
        <div className="col-start-2 col-span-10 lg:max-w-xl mx-auto text-center">
          <h3 className="text-2xl lg:text-5xl font-bold text-[#D2DFFA]">
            Quick, Accessible & <span className="text-main">User-friendly</span>
          </h3>
        </div>

        <img
          className=" absolute z-0  lg:right-0 rounded-full blur-3xl  top-0 max-w-[634px] w-full"
          src="/Index/1.svg"
        />

        <div className="col-start-2 my-2 col-span-10 grid grid-cols-1 lg:grid-cols-2">
          <div className="col-span-1 grid grid-rows-3">
            <div className="row-span-1 rounded   m-8 flex flex-row py-4">
              <div className="py-4  ">
                <span className="bg-color mx-4 rounded-full px-4 py-2">1</span>
              </div>

              <div className="flex-1 ">
                <h5 className=" text-2xl">
                  Generate Stunning Twitter Banners From Text.
                </h5>

                <p className=" opacity-70">
                  Use a general or fine-tuned model to generate all sorts of
                  production-ready art assets.
                </p>
              </div>
            </div>

            <div className="row-span-1 rounded   m-8 flex flex-row py-4">
              <div className="py-4  ">
                <span className="bg-color mx-4 rounded-full px-4 py-2">2</span>
              </div>

              <div className="flex-1 ">
                <h5 className=" text-2xl">
                  Import NFTs from Wallets or Desktop.
                </h5>

                <p className=" opacity-70">
                  Automatically remove your NFT's background and resize image so
                  you can customize & display your collection.
                </p>
              </div>
            </div>

            <div className="row-span-1 rounded m-8  flex flex-row py-4">
              <div className="py-4  ">
                <span className="bg-color mx-4 rounded-full px-4 py-2">3</span>
              </div>

              <div className="flex-1 ">
                <h5 className=" text-2xl">Blockchain Agnostic.</h5>

                <p className=" opacity-70">
                  Display your entire collection, regardless of blockchain.
                  Import via wallet or desktop means any NFT or image can be
                  added to your banner.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <img src="/Index/2.png" className="relative z-10" />
          </div>
        </div>
      </section>

      <section id="example" className="grid relative py-4 grid-cols-12">
        <div className="col-start-2 my-3 col-span-10 lg:max-w-xl mx-auto text-center">
          <h3 className="text-2xl lg:text-5xl font-bold text-[#D2DFFA]">
            {" "}
            Some <span className="text-main">Examples</span>
          </h3>
        </div>

        <img
          className=" absolute z-0  lg:right-0 rounded-full blur-3xl  top-0 max-w-[634px] w-full"
          src="/Index/1.svg"
        />

        <div className="col-start-2 relative z-10 my-2 col-span-10 flex flex-col max-h-screen ">
          <div className="flex w-full col-span-12 flex-row px-16 justify-around items-center">
            <div className="flex-1 flex flex-row justify-start  items-center mr-8">
              <span onClick={handleLeft} className=" cursor-pointer">
                {"<"}
              </span>
            </div>

            <div className="text-center">
              <img
                src={stockImages[image].src}
                className="w-full  mx-auto max-w-[800px]"
              />
              <p className="my-3 mx-auto ">
                " {stockImages[image].title.split("_").join(" ")} "{" "}
              </p>
            </div>

            <div className="flex-1  flex flex-row justify-end items-center ml-8">
              <span onClick={handleRight} className=" cursor-pointer">
                {">"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12">
        <div className="col-start-2 col-span-10 lg:max-w-xl mx-auto text-center">
          <h3 className="text-2xl lg:text-5xl font-bold text-[#D2DFFA]">
            Generate Stunning banners within{" "}
            <span className="text-main">seconds</span>
          </h3>
        </div>

        <div className="col-start-2 col-span-10 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="px-8 py-12 my-3 border border-b-color  flex flex-col justify-around items-center">
            <img src="/Index/4.svg" />

            <h4 className="text-[#D2DFFA] my-4 text-2xl">Generate Banner</h4>
            <p className="text-[#D2DFFA] text-center font-medium">
              Generate Banner Let your imagination run wild by generating a
              twitter banner using the text of your choice. Build your Brand
              Take advantage of your Twitters home page and build your personal
              or business brand
            </p>
          </div>

          <div className="px-8 py-12 my-3 border border-b-color rounded-xl flex flex-col justify-around items-center">
            <img src="/Index/2.svg" />

            <h4 className="text-[#D2DFFA] text-center my-4 text-2xl">
              Import NFT's & Pay in crypto
            </h4>
            <p className="text-[#D2DFFA] text-center font-medium">
              Pay in ETH, SOL, USDC, or USDT
            </p>
          </div>

          <div className="px-8 py-12 my-3 border border-b-color rounded-xl flex flex-col justify-around items-center">
            <img src="/Index/11.svg" />

            <h4 className="text-[#D2DFFA] my-4 text-2xl">Display</h4>
            <p className="text-[#D2DFFA] text-center font-medium">
              Save your banner and upload to Twitter to customize your home page
              and display your entre collection.
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid my-8 grid-cols-12"
      >
        <div className="lg:col-start-4 col-start-2 col-span-10 lg:col-span-6 p-8 border-b-color sh">
          <h2 className="text-2xl">Get In Touch</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            <input
              value={name}
              onChange={handleName}
              className="col-span-1 p-4 m-2 contact-input"
              placeholder="Your Name"
            />
            <input
              value={userMail}
              onChange={handleUserMail}
              className="col-span-1 p-4 m-2 mr-0 contact-input"
              placeholder="Email Address"
            />
          </div>

          <textarea
            value={message}
            onChange={handleMessage}
            className="p-4 m-2 contact-input w-full min-h-[280px]"
          ></textarea>

          <button
            onClick={() => {
              SendEmail(userMail, message, name);
              setUserMail("");
              setName("");
              setMessage("");
              setSuccess("Email Has Been Sent!");
            }}
            className="main-btn flex flex-row justify-between items-center hover:cursor-pointer rounded"
          >
            Send A Message
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 ml-3 hover:cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </button>
        </div>
      </form>

      {errors ? (
        <div className="toast toast-end">
          {" "}
          <div className="alert alert-error shadow-lg w-[100%]">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error! {errors}.</span>
            </div>
          </div>{" "}
        </div>
      ) : (
        ""
      )}

      {success ? (
        <div className="toast toast-end">
          {" "}
          <div className="alert alert-success shadow-lg w-[100%]">
            <div>
              <span>Success! {success}.</span>
            </div>
          </div>{" "}
        </div>
      ) : (
        ""
      )}

      <div className="bg-black p-8 grid grid-cols-12">
        <div className="lg:col-start-3 flex flex-col lg:grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-6 col-start-2 col-span-10 lg:col-span-10">
          <img
            className="row-span-1 col-span-3 max-w-[80vw] w-40"
            src="/logo.png"
          />

          <div className="flex flex-col">
            <h6 className="text-lg my-2"> Stay tuned!</h6>
            <a className="text-sm my-1 cursor-pointer opacity-70">Discord</a>
            <a className="text-sm my-1 cursor-pointer  opacity-70">Twitter</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
