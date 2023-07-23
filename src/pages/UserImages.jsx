import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { useEffect } from "react";
import MobileMenuNav from "../Components/MobileMenu";
import axios from "axios";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const UserImages = () => {
  const { publicKey, connected } = useWallet();
  const [images, setImages] = useState([]);
  const location = useLocation();
  const { walletAddress } = location.state;

  const fetchUserImages = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/image/${publicKey ? publicKey : walletAddress}`
    );
    setImages(response.data);
    console.log(response.data);
  };
  // console.log(images);
  useEffect(() => {
    if (connected || walletAddress) {
      fetchUserImages();
    }
  }, [connected, walletAddress]);

  return (
    <>
      <div className="col-start-2 p-8 lg:col-start-1 col-span-10 lg:col-span-8 items-center justify-between grid grid-cols-5 gap-4">
        <Link to="/">
          <img src="/logo.png" className="col-span-1 max-w-[162px]" />
        </Link>

        <nav className="hidden lg:flex flex-row items-center justify-between gap-5 whitespace-nowrap col-start-3 col-span-2">
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
          {images && (
            <Link
              to="/user_images"
              className="hover:border-b-2 border-b-transparent   border-b-color hover:cursor-pointer"
            >
              {" "}
              Images
            </Link>
          )}
        </nav>

        <MobileMenuNav />
      </div>

      <div className="h-screen pt-20 lg:py-5 w-full flex flex-col flex-wrap lg:flex-row justify-center items-center gap-20 overflow-y-scroll">
        {images.length > 0 ? (
          images.map(
            (item) =>
              item.image !== "" && (
                <div
                  key={item._id}
                  className="flex flex-col justify-center items-center gap-4"
                >
                  <img
                    loading="lazy"
                    src={item?.image}
                    className="max-w-[70%]"
                    alt="image"
                  />
                  <p className="text-white text-center text-xl">{`"${item?.prompt}"`}</p>
                </div>
              )
          )
        ) : (
          <div>
            <h1 className="text-white text-4xl font-bold text-center">
              You haven't generated images yet!
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default UserImages;
